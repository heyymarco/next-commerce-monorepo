import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
    Styles,
    HeadPortal,
} from '@cssfn/cssfn-react'
import '@reusable-ui/typos/effects';
import { Button, Icon } from '@reusable-ui/components'
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
                
                <button onClick={async () => {
                    const answer = await showMessage<'ok'|'no'|'maybe'>({
                        title : <span>Say Hello</span>,
                        message: <>
                            <p>
                                Hello <strong>world</strong>!
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </p>
                        </>,
                        options: {
                            ok   : <Button>Yea</Button>,
                            no    : <Button>Noo</Button>,
                            maybe : <Button>Ummm</Button>,
                        }
                        
                    });
                    showMessageNotification({
                        notification : <>
                            The answer is <strong>{`${answer}`}</strong>
                        </>,
                    });
                }}>
                    Show Modal with options
                </button>
                
                <button onClick={async () => {
                    const answer = await showMessage<'yes'|'no'|'maybe'|'sure'>({
                        title : <span>Say Hello</span>,
                        message: <>
                            <p>
                                Hello <strong>world</strong>!
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </p>
                        </>,
                        options: {
                            yes   : <Button type='submit'>Yea</Button>,
                            no    : <Button theme='warning'>Noo</Button>,
                            maybe : <>Ummm</>,
                            sure  : [
                                <Icon key={0} icon='face' />,
                                <span key={1}>Sure!</span>
                            ],
                        }
                        
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
