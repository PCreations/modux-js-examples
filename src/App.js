import React, { Component } from 'react';
import { take, put, select } from 'redux-saga/effects';
import moduxFactory from 'modux-js';

import logo from './logo.svg';
import './App.css';
import DevTools from './DevTools';
import buttonModux, { types as buttonTypes } from './button';
import counterModux, { init as initCounter } from './counter';
import gifViewerModux, { init as initGifViewer, types as gifViewerTypes } from './gif-viewer';
import gifViewerPairModux, { init as initGifViewerPair } from './gif-viewer-pair';
import gifViewerPairPairModux, { init as initGifViewerPairPair } from './gif-viewer-pair-pair';

const newGifCounterModux = moduxFactory(context => {
  context.add(counterModux, 'counter', initCounter(0))
  context.add(buttonModux, 'button')
  return {
    initSaga() {
      function *watchForNewGif() {
        while (true) {
          yield take(gifViewerTypes.RECEIVE_GIF)
          const isButtonActive = yield select(context.getSelectors('button').isActive)
          const counterValue = yield select(context.getSelectors('counter').getValue)
          const amount = counterValue >= 3 && isButtonActive ? 2 : 1
          yield put(context.getActions('counter').increment(amount))
        }
      }
      return watchForNewGif
    },
    initView() {
      return {
        Counter: context.getView('counter'),
        Button: context.getView('button')
      }
    }
  }
})

export const root = moduxFactory(context => {
  context.add(buttonModux, 'button')
  context.add(newGifCounterModux, 'newGifCounter')
  context.add(gifViewerModux, 'cats', initGifViewer('high five'))
  context.add(gifViewerPairModux, 'gifViewerPair', initGifViewerPair('jugding you', 'bored'))
  context.add(gifViewerPairPairModux, 'gifViewerPairPair', initGifViewerPairPair([
    'annoyed',
    'unsure'
  ],[
    'terrified',
    'excited'
  ]))
  return {
    initView() {
      const {
        Button,
        Counter: NewGifCounter
      } = context.getView('newGifCounter')
      const CatsGifViewer = context.getView('cats')
      const GifViewerPair = context.getView('gifViewerPair')
      const GifViewerPairPair = context.getView('gifViewerPairPair')
      return () => (
        <div>
          <div>
            <Button/>
          </div>
          <div>
            <NewGifCounter/>
          </div>
          <h1>Random gifs</h1>
          <div>
            <CatsGifViewer/>
          </div>
          <hr/>
          <h1>Random Gif Pair</h1>
          <GifViewerPair/>
          <hr/>
          <h1>Random Gif Pair Pair</h1>
          <GifViewerPairPair/>
        </div>
      )
    }
  }
})()

class App extends Component {
  render() {
    return (
      <div className="App">
        <div style={{ textAlign: 'left' }}>
          <DevTools/>
        </div>
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          <root.view/>
        </p>
      </div>
    );
  }
}

export default App;
