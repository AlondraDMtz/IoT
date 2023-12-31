import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';


export default function Forecasting(){
    const [datos, setDatos] = useState([]);

    useEffect(() => {

        async function request() {

            const { data } = await supabase
                .from('measurements')
                .select()
            let Temperaturee = data.map((d, i) => ({
                temperature: d.temperature,
                dia: i
            }))
            setDatos(Temperaturee );
        }

        request();

    }, []);
    async function run() {
        // Load and plot the original input data that we are going to train on.
        const data = await datos;
        const values = data.map(d => ({
          x: d.dia,
          y: d.temperature,
        }));
    
        tfvis.render.scatterplot(
          { name: 'Temperature' },
          { values },
          {
            xLabel: 'dia',
            yLabel: 'Temperature',
            height: 300
          }
        );
    
        // Convert data to TensorFlow format and normalize
        const tensorData = convertToTensor(data);
        const { inputs, labels} = tensorData;
    
        // Create the model
        const model = createModel();
        tfvis.show.modelSummary({ name: 'Model Summary' }, model);
    
        // Train the model
        await trainModel(model, inputs, labels);
        console.log('Done Training');
    
        // Test the model
        testModel(model, data,tensorData);
      }
      run();

      function createModel() {
        // Create a sequential model
        const model = tf.sequential();
    
        // Add a single input layer
        model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));
    
        // Add an output layer
        model.add(tf.layers.dense({ units: 1, useBias: true }));
    
        return model;
      }
      function convertToTensor(data) {
        // Wrapping these calculations in a tidy will dispose any
        // intermediate tensors.
        return tf.tidy(() => {
          // Step 1. Shuffle the data
          tf.util.shuffle(data);
    
          // Step 2. Convert data to Tensor
          const inputs = data.map(d => d.temperature);
          const labels = data.map(d => d.dia);
    
          const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
          const labelTensor = tf.tensor2d(labels, [labels.length, 1]);
    
          // Step 3. Normalize the data to the range 0 - 1 using min-max scaling
          const inputMax = inputTensor.max();
          const inputMin = inputTensor.min();
          const labelMax = labelTensor.max();
          const labelMin = labelTensor.min();
    
          const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
          const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));
    
          return {
            inputs: normalizedInputs,
            labels: normalizedLabels,
            // Return the min/max bounds so we can use them later.
            inputMax,
            inputMin,
            labelMax,
            labelMin,
          };
        });
      }
      async function trainModel(model, inputs, labels) {
        // Prepare the model for training.
        model.compile({
          optimizer: tf.train.adam(),
          loss: tf.losses.meanSquaredError,
          metrics: ['mse'],
        });
    
        const batchSize = 512;
        const epochs = 50;
    
        return await model.fit(inputs, labels, {
          batchSize,
          epochs,
          shuffle: true,
          callbacks: tfvis.show.fitCallbacks(
            { name: 'Training Performance' },
            ['loss', 'mse'],
            { height: 200, callbacks: ['onEpochEnd'] }
          )
        });
      }
      function testModel(model, inputData, normalizationData) {
        const { inputMax, inputMin, labelMin, labelMax } = normalizationData;
    
        // Generate predictions for a uniform range of numbers between 0 and 1;
        // We un-normalize the data by doing the inverse of the min-max scaling
        // that we did earlier.
        const [xs, preds] = tf.tidy(() => {
          const xs = tf.linspace(0, 1, 100);
          const preds = model.predict(xs.reshape([100, 1]));
    
          const unNormXs = xs
            .mul(inputMax.sub(inputMin))
            .add(inputMin);
    
          const unNormPreds = preds
            .mul(labelMax.sub(labelMin))
            .add(labelMin);
    
          // Un-normalize the data
          return [unNormXs.dataSync(), unNormPreds.dataSync()];
        });
    
        const predictedPoints = Array.from(xs).map((val, i) => {
          return { x: preds[i], y: val };
        });
    
        const originalPoints = inputData.map(d => ({
          x: d.temperature,
          y: d.humidity,
        }));
    
        tfvis.render.scatterplot(
          { name: 'Model Predictions vs Original Data' },
          { values: [originalPoints, predictedPoints], series: ['original', 'predicted'] },
          {
            xLabel: 'Dia',
            yLabel: 'Temperatura',
            height: 300
          }
        );
      }
      return (
        <>

        </>
    )
}