import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
    Styles,
    HeadPortal,
} from '@cssfn/cssfn-react'
import '@reusable-ui/typos/effects';
import { useDialogMessage } from '@heymarco/dialog-message';



function App() {
    const { showMessage, showMessageNotification } = useDialogMessage();
    return (
        <>
            <HeadPortal>
                <Styles />
            </HeadPortal>
            <div className="App">
                <button onClick={() => showMessage({
                    title : <span>Say Hello</span>,
                    message: <>
                        <p>
                            Hello <strong>world</strong>!
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </p>
                    </>,
                })}>
                    Show Modal
                </button>
                
                <button onClick={async () => {
                    const answer = await showMessage({
                        title : <span>Say Hello</span>,
                        message: <>
                            <p>
                                Hello <strong>world</strong>!
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </p>
                        </>,
                    });
                    showMessageNotification({
                        notification : <>
                            The answer is <strong>{`${answer}`}</strong>
                        </>,
                    });
                }}>
                    Show Modal with options
                </button>
            </div>
        </>
    );
}

export default App;
