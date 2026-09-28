/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Header } from './components/Header';
import { SimpleAgentView } from './components/SimpleAgentView';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />
      <main className="flex-1 py-4">
        <SimpleAgentView />
      </main>
    </div>
  );
}
