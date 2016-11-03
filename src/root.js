import React from 'react'
import moduxFactory from 'modux-js'
import { take, put, select } from 'redux-saga/effects';

import buttonModux, { types as buttonTypes } from './button';
import counterModux, { init as initCounter } from './counter';
import gifViewerModux, { init as initGifViewer, types as gifViewerTypes } from './gif-viewer';
import gifViewerPairModux, { init as initGifViewerPair } from './gif-viewer-pair';
import gifViewerPairPairModux, { init as initGifViewerPairPair } from './gif-viewer-pair-pair';
import giViewerList from './gif-viewer-list';

export default moduxFactory(context => {
  context.add(buttonModux, 'button')
  context.add(counterModux, 'newGifCounter', initCounter(0))
  context.add(gifViewerModux, 'gifViewer', initGifViewer('high five'))
  context.add(gifViewerPairModux, 'gifViewerPair', initGifViewerPair('jugding you', 'bored'))
  context.add(gifViewerPairPairModux, 'gifViewerPairPair', initGifViewerPairPair([
    'annoyed',
    'unsure'
  ],[
    'terrified',
    'excited'
  ]))
  context.add(giViewerList, 'gifViewerList')
  return {
    initSaga() {
      function *watchForNewGif() {
        while (true) {
          yield take(gifViewerTypes.RECEIVE_GIF)
          const isButtonActive = yield select(context.getSelectors('button').isActive)
          const counterValue = yield select(context.getSelectors('newGifCounter').getValue)
          const amount = counterValue >= 3 && isButtonActive ? 2 : 1
          yield put(context.getActions('newGifCounter').increment(amount))
        }
      }
      return watchForNewGif
    },
    initView() {
      const Button = context.getView('button')
      const NewGifCounter = context.getView('newGifCounter')
      const GifViewer = context.getView('gifViewer')
      const GifViewerPair = context.getView('gifViewerPair')
      const GifViewerPairPair = context.getView('gifViewerPairPair')
      const GifViewerList = context.getView('gifViewerList')
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
            <GifViewer/>
          </div>
          <hr/>
          <h1>Random Gif Pair</h1>
          <GifViewerPair/>
          <hr/>
          <h1>Random Gif Pair Pair</h1>
          <GifViewerPairPair/>
          <hr/>
          <h1>Dynamic list of Gif Viewers</h1>
          <GifViewerList/>
        </div>
      )
    }
  }
})()  // we directly export an instantiated modux, not the factory, since there is only one root
