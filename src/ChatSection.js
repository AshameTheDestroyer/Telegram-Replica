import React, { useState, useEffect, useRef } from 'react';
import { APP_ACTIONS, IsEmpty } from './App.js';
import './chat_section.css';
import { RenderFull } from './Time.js';
import search_icon from './Icons/search.png';
import call_icon from './Icons/call.png';
import section_icon from './Icons/column.png';
import menu_icon from './Icons/menu_settings.png';
import delete_icon from './Icons/delete_2.png';
import attachment_icon from './Icons/attachment.png';
import emoji_icon from './Icons/emoji.png';
import record_icon from './Icons/microphone.png';
import send_icon from './Icons/telegram_send.png';
import back_icon from './Icons/arrow.png';
import Icon from './Icon.js';

export default function ChatSection({
    appDispatch = null,
    appState = {},
    isBlurred = false,
    pinnedMessages = ['some sorta random pinned message goes here.']
}) {
    const [textValue, setTextValue] = useState('');
    const textInputRef = new useRef();

    useEffect(() => {
        document.querySelector('.chat_section').addEventListener('keydown', HandleKeyDown);
    });

    useEffect(() => {
        if (appState.selectedMessage) { setTextValue(appState.selectedMessage.draftMessage ?? ''); }
    }, [appState.selectedMessage]);

    function HandleKeyDown(e) {
        if (e.key === 'Escape') {
            appState.selectedMessage.draftMessage = textValue;
            appDispatch({ type: APP_ACTIONS.RERENDER });
        }
    }

    function CloseChat() {
        let event = new Event('keydown');
        event.key = 'Escape';
        document.querySelector('.chat_section').dispatchEvent(event);
    }

    function ToggleInfoMenu(e) {
        appDispatch({ type: APP_ACTIONS.TOGGLE_INFO_MENU, payload: { value: !appState.isInfoMenuShown } });
    }

    function Header({ message }) {
        return (
            <div class='header'>
                <IconButton className='back' iconURL={back_icon} toolTip='Go back to messages.' ApplyOnClick={CloseChat} tabIndex={isBlurred ? -1 : 0} />
                <Icon iconURL={message?.iconURL} name={message?.sender?.name} colour={message?.iconColour} />
                <div class='sender' onClick={ToggleInfoMenu}>
                    <div class='sender_name'>{message?.sender?.name}</div>
                    <div class='sender_time'>{message && 'last seen at'} {RenderFull(message?.sender?.lastSeenTime)}</div>
                </div>
                <IconButton className='search' iconURL={search_icon} toolTip='Search for messages within the chat.' tabIndex={isBlurred ? -1 : 0} />
                <IconButton className='call' iconURL={call_icon} toolTip={`Call ${message?.sender?.name}.`} tabIndex={isBlurred ? -1 : 0} />
                <IconButton className='section' iconURL={section_icon} toolTip='Open full details section.' tabIndex={isBlurred ? -1 : 0} ApplyOnClick={ToggleInfoMenu} appliedStyle={{
                    '--filter': appState.isInfoMenuShown ? 'var(--sub-fore-colour-filter-on)' : '',
                    '--hover-filter': appState.isInfoMenuShown ? 'none' : '',
                    '--colour': appState.isInfoMenuShown ? 'hsl(var(--sub-fore-colour), 30%)' : ''
                }} />
                <IconButton className='menu' iconURL={menu_icon} toolTip={`Adjust the settings of ${message?.sender?.name}.`} tabIndex={isBlurred ? -1 : 0} />
            </div>
        );
    }

    function PinnedMessages() {
        return (
            <div class='pinned_messages'>
                <div class='scroll_bar' />
                <div class='text'>
                    <div class='label'>Pinned messages</div>
                    <abbr class='messages' title={pinnedMessages[0]}>{pinnedMessages[0]}</abbr>
                </div>
                <IconButton iconURL={delete_icon} toolTip='Close pinned messages.' tabIndex={isBlurred ? -1 : 0} />
            </div>
        );
    }

    function MainSection() {
        return (
            <div class='main_section'>
            </div>
        );
    }

    return (
        <div class='chat_section'>
            <div class='chat' style={{
                opacity: appState.selectedMessage ? 1 : 0,
                visibility: appState.selectedMessage ? '' : 'hidden'
            }}>
                <Header message={appState.selectedMessage} />
                <PinnedMessages />
                <MainSection />
                <TextSection appDispatch={appDispatch} appState={appState} textValue={textValue} setTextValue={setTextValue} textInputRef={textInputRef} isBlurred={isBlurred} />
            </div>
            <div class='empty'>
                <div class='select_chat_message'>Select a chat to start messaging</div>
            </div>
        </div>
    );
}

export function IconButton({
    iconURL = '',
    className = '',
    toolTip = '',
    appliedStyle = {},
    ApplyOnClick = () => {},
    tabIndex = 0
}) {
    return (
        <abbr class={'icon_button' + ` ${className}`} title={toolTip} style={appliedStyle} onClick={ApplyOnClick}>
            <button style={{ backgroundImage: `url(${iconURL})` }} tabIndex={tabIndex} />
        </abbr>
    );
}

function TextSection({
    appDispatch = null,
    appState = {},
    textValue = '',
    setTextValue = () => {},
    textInputRef = {},
    isBlurred = false
}) {

    function SendMessage() {
        setTextValue('');
        appState.selectedMessage.draftMessage = '';
        appDispatch({ type: APP_ACTIONS.RERENDER });
    }

    function UpdateDraftMessage(e) {
        if (appState.selectedMessage) {
            appState.selectedMessage.draftMessage = e.target.value;
            appDispatch({ type: APP_ACTIONS.RERENDER });
        }
    }

    return (
        <div class='text_section'>
            <IconButton className='attachment' iconURL={attachment_icon} toolTip='Attach a file to the message.' tabIndex={isBlurred ? -1 : 0} />
            
            <div class='text_input_container'>
                <div class='text_input_placeholder' style={{
                    transform: (textValue === '' ? '' : 'translateX(50%)') + ' translateY(-50%)',
                    opacity: textValue === '' ? '' : '0'
                }} onFocus={e => textInputRef.current.focus()} tabIndex={isBlurred ? -1 : 0}>Write a message...</div>
                <input ref={textInputRef} class='text_input' onBlur={UpdateDraftMessage} value={textValue} onChange={e => setTextValue(e.target.value)} tabIndex={isBlurred ? -1 : 0} />
            </div>

            <IconButton className='emoji' iconURL={emoji_icon} toolTip='Insert an emoji into your message.' tabIndex={isBlurred ? -1 : 0} />

            <IconButton className='record' iconURL={record_icon} toolTip='Record your voice to send it as a message.' tabIndex={isBlurred ? -1 : 0} appliedStyle={{
                opacity: IsEmpty(textValue) ? '' : '0',
                visibility: IsEmpty(textValue) ? '' : 'hidden',
            }} />
            
            <IconButton className='send' iconURL={send_icon} toolTip='Send this message.' tabIndex={isBlurred ? -1 : 0} appliedStyle={{
                opacity: IsEmpty(textValue) ? '0' : '',
                visibility: IsEmpty(textValue) ? 'hidden' : '',
            }} ApplyOnClick={SendMessage} />
        </div>
    );
}