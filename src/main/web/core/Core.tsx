import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch, Redirect} from 'react-router-dom';
import {Log, Level} from 'typescript-logger/build/index';

import Body from './layout/Body';
import Footer from './layout/Footer';
import Header from './layout/Header';
import Navigation from './layout/Navigation';
import CoreStore from './stores/core/CoreStore';

import DocumentScene from '../DocumentComponent';
import IndexScene from '../IndexComponent';
import SearchScene from '../SearchComponent';

import 'bootstrap/dist/css/bootstrap.css';
import './Core.css';

export default class Core extends React.Component<any, any> {

    public LOGGER = Log.create('Core');

    constructor(props: any) {
        super(props);
    }

    public componentWillMount() {
        CoreStore.register();
    }

    public render() {
        return (
            <main role='main' className='inner cover'>
                <Header />
                <Navigation />
                <Body>
                    <SearchScene/>
                    <div className='row'>
                        <div className='col-md-6'>
                            <DocumentScene />
                        </div>
                        <div className='col-md-6'>
                            <IndexScene />
                        </div>
                    </div>
                </Body>
                <Footer />
            </main>
        );
    }
}
