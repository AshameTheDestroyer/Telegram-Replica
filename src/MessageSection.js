import React, { useState, useReducer, useRef, useEffect } from 'react';
import Message from './Message.js';
import './style.css';
import './message_section.css';
import { APP_ACTIONS, PickRandomColour } from './App.js';
import archive_logo from './Icons/archive.png';

export const MESSAGE_SECTION_ACTIONS = {
    SELECT: 'select'
};

function Reducer(state, { type, payload }) {
    switch (type) {
        case MESSAGE_SECTION_ACTIONS.SELECT:
            if (state.selectedMessage !== payload.message)
            { state.Toggle?.(false); }
            state.appDispatch?.({ type: APP_ACTIONS.SELECT_MESSAGE, payload: payload });
            return {
                ...state,
                selectedMessage: payload.message,
                Toggle: payload.Toggle
            }
        default:
            return state;
    }
}

export default function MessageSection({
    appDispatch = null,
    messages = [],
    ToggleSideMenu = () => {}
}) {
    messages.forEach(message => {
        message.id ??= Math.random();
        message.iconColour ??= PickRandomColour();
        message.selected = false;
    });
    const [searchedValue, setSearchedValue] = useState('');
    const [state, dispatch] = useReducer(Reducer, { selectedMessage: null, appDispatch: appDispatch });
    const searchInputRef = new useRef();
    const GetArchivedMessages = () => messages.filter(message => message.archived);
    const [isBlurred, setBlurred] = useState(false);

    useEffect(() => {
        state.appDispatch?.({ type: APP_ACTIONS.SET_TOGGLE_MESSAGES_BLURRED, payload: { ToggleMessagesBlurred: ToggleBlurred } });
    }, []);

    function GetArchivedMessageSenders() {
        let result = '';
        let archivedMessages = GetArchivedMessages();
        archivedMessages.forEach((message, i) => {
            result += message.sender + (i < archivedMessages.length - 1 ? i === archivedMessages.length - 2 ? ' and ' : ', ' : '.');
        });
        return result;
    }

    function ToggleBlurred(value) {
        setBlurred(value);
    }

    function OpenSideMenu() {
        ToggleSideMenu?.(true);
        ToggleBlurred(true);
    }

    return (
        <nav class="message_section">
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
                        sender: 'Archived chats',
                        content: GetArchivedMessageSenders(),
                        iconURL: archive_logo,
                        blank: true,
                    }} isBlurred={isBlurred} />
                }
                {
                    messages.length > 0 ?
                    messages.filter(message => (searchedValue !== '' || !message.archived) && message.sender.toLowerCase().includes(searchedValue.toLowerCase()))
                    .map(message =>
                        <Message message={message} key={message.id} sectionDispatch={dispatch} isBlurred={isBlurred} />
                    ) : (
                        <div class="loading_message">Loading...</div>
                    )
                }
            </div>
        </nav>
    );
}
