import React, { useReducer } from 'react';
import MessageSection from './MessageSection.js';
import ChatSection from './ChatSection.js';
import SideMenu from './SideMenu.js';
import InfoMenu from './InfoMenu.js';
import ashame_s_logo from './Images/ashame_s_logo.png';
import { PickRandomTime } from './Time.js';
import './style.css';

const DATA = {
    messages: [
        {
            sender: { name: '☺☻ aleeh ☻☺' },
            content: 'IKR? it was fun!',
            arrived: false
        },
        {
            sender: { name: 'Hisham S' },
            content: 'I\'m so concerned \'bout it, what\'s your opinion on it tho?',
            read: true,
            includesHeart: true
        },
        {
            sender: { name: 'doha haj' },
            content: 'how did you even make it? it\'s on fire!',
            recieved: true,
            messagesCount: 3,
            includesHeart: true,
        },
        {
            sender: { name: 'Wi11iam' },
            content: 'AYO TF HOW!?',
            recieved: true,
            messagesCount: 13
        },
        {
            sender: { name: 'Z4HR4 ♥' },
            content: 'Wanna fight?'
        },
        {
            sender: { name: 'Yak' },
            draftMessage: 'Alright, that sounds fun..',
            draft: true
        },
        {
            sender: { name: 'Mei' },
            content: 'Check Out My New Tech!!',
            archived: true,
            recieved: true,
            messagesCount: 5,
            includesHeart: true
        },
        {
            sender: { name: 'Aito' },
            content: 'Sounds boring >:O',
            archived: true,
            recieved: true
        },
        {
            sender: { name: 'Hush Hush' },
            content: 'Whatever.',
            archived: true,
            read: true
        },
        {
            sender: { name: 'Traumatized Dot Com' },
            content: 'STOP SENDING ME CORPSES PICS YOU DAMN IDIOT@$!',
            recieved: true,
        },
        {
            sender: { name: 'Entire Hero' },
            content: 'You shall learn this okay?',
            archived: true,
            recieved: true,
            read: true
        },
        {
            sender: { name: 'Rim' },
            content: 'Fuck you.',
            archived: true,
            recieved: true,
            read: true
        },
        {
            sender: { name: 'Dad' },
            content: 'where tf r u',
            recieved: true,
            messagesCount: 2
        },
        {
            sender: { name: 'Mom' },
            content: 'Mom come\'n where are you? fr.'
        }
    ],
    user: { name: '\'Ashame', iconURL: ashame_s_logo }
};

const COLOURS = [
    'deepskyblue',
    'gold',
    'limegreen',
    'orange',
    'magenta'
];

export function PickRandomColour() {
    return COLOURS[Math.floor(Math.random() * COLOURS.length)];
}

export function PickRandomPhoneNumber() {
    return +('963' + Math.random()).replace('.', '').substring(0, 12);
}

export function DisplayPhoneNumber(phone) {
    let result = '+';
    Array.from((phone + '')).forEach((c, i) => {
        result += c;
        if ((i + 1) % 3 === 0) { result += ' '; }
    });
    return result;
}

export function IsEmpty(string) {
    return [...string].every(c => c === ' ');
}

export const APP_ACTIONS = {
    // Gets called by the message section to tell other sections a message has been selected.
    SELECT_MESSAGE: 'select_message',
    // Gets called by the message section to tell other sections the current selected message has been deselected.
    DESELECT_MESSAGE: 'deselect_message',
    // Simply toggles the Side Menu.
    TOGGLE_SIDE_MENU: 'toggle_side_menu',
    // Simply toggles the Side Menu.
    TOGGLE_INFO_MENU: 'toggle_info_menu',
    // Rerenders the messages to ensure data renders well.
    RERENDER: 'rerender'
};

function Reducer(state, { type, payload }) {
    switch (type) {
        case APP_ACTIONS.SELECT_MESSAGE:
            return {
                ...state,
                selectedMessage: payload.message
            };
        case APP_ACTIONS.DESELECT_MESSAGE:
            return {
                ...state,
                selectedMessage: null
            };
        case APP_ACTIONS.TOGGLE_SIDE_MENU:
            let sideMenuQuery = document.querySelector(payload.value ? '.side_menu' : '.message_section');
            sideMenuQuery.tabIndex = 0;
            sideMenuQuery.focus();
            sideMenuQuery.tabIndex = -1;

            return {
                ...state,
                isSideMenuShown: payload.value
            };
        case APP_ACTIONS.TOGGLE_INFO_MENU:
            setTimeout(() => {
                let infoMenuQuery = document.querySelector(payload.value ? '.info_menu' : '.message_section');
                infoMenuQuery.tabIndex = 0;
                infoMenuQuery.focus();
                infoMenuQuery.tabIndex = -1;
            }, 500);

            return {
                ...state,
                isInfoMenuShown: payload.value
            };
        case APP_ACTIONS.RERENDER:
            return {...state};
        default:
            return state;
    }
}

export const AppContext = React.createContext({});

export default function App() {
    const [state, dispatch] = useReducer(Reducer, {});

    DATA.messages.forEach(message => {
        message.time ??= PickRandomTime();
        message.iconColour ??= PickRandomColour();
        message.sender.phone ??= PickRandomPhoneNumber();
        message.sender.bio ??= 'Here goes my bio. ~';
        message.sender.lastSeenTime ??= PickRandomTime();
    });

    function HandleBlackCoverClick() {
        if (state.isSideMenuShown) {
            dispatch({ type: APP_ACTIONS.TOGGLE_SIDE_MENU, payload: { value: false } });
        }
        else if (state.isInfoMenuShown) {
            dispatch({ type: APP_ACTIONS.TOGGLE_INFO_MENU, payload: { value: false } });
        }
    }

    return (
        <div id='page'>
            <div class='black_cover side_menu_cover' onClick={HandleBlackCoverClick} style={{
                opacity: state.isSideMenuShown ? '' : 0,
                visibility: state.isSideMenuShown ? 'visible' : 'hidden'
            }} />
            <div class='black_cover info_menu_cover' onClick={HandleBlackCoverClick} style={{
                opacity: state.isInfoMenuShown && !state.isSideMenuShown && state.selectedMessage ? '' : 0,
                visibility: state.isInfoMenuShown && !state.isSideMenuShown && state.selectedMessage ? '' : 'hidden'
            }} />

            <MessageSection appDispatch={dispatch} appState={state} messages={DATA.messages} isBlurred={state.isSideMenuShown} />
            <ChatSection appDispatch={dispatch} appState={state} selectedMessage={state.selectedMessage} isBlurred={state.isSideMenuShown} />
            <InfoMenu appDispatch={dispatch} appState={state} selectedMessage={state.selectedMessage} isShown={state.isInfoMenuShown} isBlurred={state.isSideMenuShown} />
            <SideMenu appDispatch={dispatch} appState={state} user={DATA.user} isShown={state.isSideMenuShown} />
        </div>
    );
}