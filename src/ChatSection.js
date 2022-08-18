import React, { useState, useReducer, useEffect } from 'react';
import { APP_ACTIONS } from './App.js';
import './chat_section.css';

const CHAT_ACTIONS = {
    SET_UPDATE: 'set_update',
    SELECT_MESSAGE: 'select_message'
};

function Reducer(state, { type, payload }) {
    switch (type) {
        case CHAT_ACTIONS.SET_UPDATE:
            state.appDispatch?.({ type: APP_ACTIONS.SET_SELECTED_UPDATING, payload: { UpdateSelected: payload.UpdateSelected } });
            return state;
        case CHAT_ACTIONS.SELECT_MESSAGE:
            return {
                ...state,
                selectedMessage: payload.message
            };
        default:
            return state;
    }
}

export default function ChatSection({
    appDispatch = null,
    selectedMessage= null
}) {
    const [state, dispatch] = useReducer(Reducer, { appDispatch: appDispatch, selectedMessage: selectedMessage });

    useEffect(() => {
        dispatch({ type: CHAT_ACTIONS.SET_UPDATE, payload: { UpdateSelected: UpdateSelected } });
    }, []);

    function UpdateSelected(message) {
        dispatch({ type: CHAT_ACTIONS.SELECT_MESSAGE, payload: { message: message } });
    }

    function Chat({ message }) {
        return (
            <div class='chat'>
                <div class='header'>
                    {message.sender}
                </div>
            </div>
        );
    }

    return (
        <div class='chat_section'>
            {
                state.selectedMessage ?
                <Chat message={state.selectedMessage} /> :
                <div class='empty'>
                    <div class='select_chat_message'>Select a chat to start messaging</div>
                </div>
            }
        </div>
    );
}
