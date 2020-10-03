import React, {Suspense} from 'react';

import {DoneTaskProvider} from './_context/DoneTaskContext';
import {PendingTaskProvider} from './_context/PendingTaskContext';
import {AppProvider} from './_context/AppContext';

import RoutedApp from './RoutedApp';

import Empty from './Component/Empty/Empty';

const Contextualize = ({children}) => {
  return [AppProvider, DoneTaskProvider, PendingTaskProvider]
    .reverse()
    .reduce((content, Context) => <Context>{content}</Context>, children);
};

export default function App() {
  return (
    <Suspense fallback={<Empty />}>
      <Contextualize>
        <RoutedApp />
      </Contextualize>
    </Suspense>
  );
}
