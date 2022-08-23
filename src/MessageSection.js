import React, { useState, useReducer, useRef, useEffect } from 'react';
import Message from './Message.js';
import './style.css';
import './message_section.css';
import archive_logo from './Icons/archive.png';
import { APP_ACTIONS } from './App.js';

export const MESSAGE_SECTION_ACTIONS = {
    SELECT: 'select',
    DESELECT: 'deselect'
};

function Reducer(state, { type, payload }) {
    switch (type) {
        case MESSAGE_SECTION_ACTIONS.SELECT:
            if (state.selectedMessage) { state.selectedMessageToggle(false); }

            payload.appDispatch({ type: APP_ACTIONS.SELECT_MESSAGE, payload: payload });
            
            return {
                ...state,
                selectedMessage: payload.message,
                selectedMessageToggle: payload.Toggle
            };
        case MESSAGE_SECTION_ACTIONS.DESELECT:
            if (state.selectedMessage) { state.selectedMessageToggle(false); }

            payload.appDispatch({ type: APP_ACTIONS.DESELECT_MESSAGE });
            
            return {
                ...state,
                selectedMessage: null,
                selectedMessageToggle: null
            }
        default:
            return state;
    }
}

export default function MessageSection({
    appDispatch = null,
    appState = {},
    isBlurred = false,
    messages = []
}) {
    const [, dispatch] = useReducer(Reducer, {});

    const [searchedValue, setSearchedValue] = useState('');
    const searchInputRef = new useRef();

    useEffect(() => {
        document.querySelector('.message_section').addEventListener('keydown', HandleKeyDown);
        document.querySelector('.chat_section').addEventListener('keydown', HandleKeyDown);
    }, []);

    messages.forEach(message => {
        message.id ??= Math.random();
        message.selected = false;
    });

    const GetArchivedMessages = () => messages.filter(message => message.archived);

    function HandleKeyDown(e) {
        if (e.key === 'Escape') {
            dispatch({ type: MESSAGE_SECTION_ACTIONS.DESELECT, payload: { appDispatch } });
        }
    }

    function GetArchivedMessageSenders() {
        let result = '';
        let archivedMessages = GetArchivedMessages();
        archivedMessages.forEach((message, i) => {
            result += message.sender.name + (i < archivedMessages.length - 1 ? i === archivedMessages.length - 2 ? ' and ' : ', ' : '.');
        });
        return result;
    }

    function OpenSideMenu() {
        appDispatch({ type: APP_ACTIONS.TOGGLE_SIDE_MENU, payload: { value: true } });
    }

    return (
        <nav class="message_section" style={{
            'resize': isBlurred ? 'none' : ''
        }}>
            <div class="header">
                <button class='side_menu_button' onClick={OpenSideMenu} tabIndex={isBlurred ? -1 : 0}></button>
                <div class='search_input_container'>
                    <div class='search_input_placeholder' style={{
                        transform: (searchedValue === '' ? '' : 'translateX(200%)') + ' translateY(-50%)',
                        opacity: searchedValue === '' ? 1 : 0
                    }} onFocus={e => searchInputRef.current.focus()} tabIndex={isBlurred ? -1 : 0}>Search</div>
                    <input ref={searchInputRef} class='search_input' value={searchedValue} onChange={e => setSearchedValue(e.target.value)} tabIndex={isBlurred ? -1 : 0} />
                    <button class='clear_input_button' style={{
                        transform: searchedValue === '' ? 'rotate(180deg) scale(0)' : 'rotate(0deg) scale(1)',
                        opacity: searchedValue === '' ? '0' : '1'
                    }} onClick={e => setSearchedValue('')} tabIndex={ isBlurred ? -1 : (searchedValue === '' ? -1 : 0) }></button>
                </div>
            </div>
            <div class="message_renderer">
                {
                    searchedValue === '' && GetArchivedMessages().length > 0 &&
                    <Message message={{
                        sender : { name: 'Archived chats' },
                        content: GetArchivedMessageSenders(),
                        iconURL: archive_logo,
                        blank: true,
                    }} isBlurred={isBlurred} />
                }
                {
                    messages.length > 0 ?
                    messages.filter(message => (searchedValue !== '' || !message.archived) && message.sender.name.toLowerCase().includes(searchedValue.toLowerCase()))
                    .map(message =>
                        <Message message={message} key={message.id} sectionDispatch={dispatch} isBlurred={isBlurred} appDispatch={appDispatch} />
                    ) : (
                        <div class="loading_message">Loading...</div>
                    )
                }
            </div>
        </nav>
    );
}
