import React, { useReducer, useEffect } from 'react';
import MessageSection from './MessageSection.js';
import ChatSection from './ChatSection.js';
import SideMenu from './SideMenu.js';
import ashame_s_logo from './Images/ashame_s_logo.png';
import './style.css';

const DATA = {
    messages: [
        {
            sender: '☺☻ aleeh ☻☺',
            content: 'IKR? it was fun!'
        },
        {
            sender: 'Hisham S',
            content: 'I\'m so concerned \'bout it, what\'s your opinion on it tho?',
            read: true,
            includesHeart: true
        },
        {
            sender: 'doha haj',
            content: 'how did you even make it? it\'s on fire!',
            recieved: true,
            messagesCount: 3,
            includesHeart: true,
        },
        {
            sender: 'Wi11iam',
            content: 'AYO TF HOW!?',
            recieved: true,
            messagesCount: 13
        },
        {
            sender: 'Z4HR4 ♥',
            content: 'Wanna fight?'
        },
        {
            sender: 'Yak',
            content: 'Alright, that sounds fun..',
            draft: true
        },
        {
            sender: 'Mei',
            content: 'Check Out My New Tech!!',
            archived: true,
            recieved: true,
            messagesCount: 5,
            includesHeart: true
        },
        {
            sender: 'Aito',
            content: 'Sounds boring >:O',
            archived: true,
            recieved: true
        },
        {
            sender: 'Hush Hush',
            content: 'Whatever.',
            archived: true,
            read: true
        },
        {
            sender: 'Traumatized Dot Com',
            content: 'STOP SENDING ME CORPSES PICS YOU DAMN IDIOT@$!',
            recieved: true,
        },
        {
            sender: 'Entire Hero',
            content: 'You shall learn this okay?',
            archived: true,
            recieved: true,
            read: true
        },
        {
            sender: 'Rim',
            content: 'Fuck you.',
            archived: true,
            recieved: true,
            read: true
        },
        {
            sender: 'Dad',
            content: 'where tf r u',
            recieved: true,
            messagesCount: 2
        },
        {
            sender: 'Mom',
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

export const APP_ACTIONS = {
    // Selects a message from the Message Section.
    SELECT_MESSAGE: 'select_message',
    // Deselects the current selected message from the Message Section.
    DESELECT_MESSAGE: 'deselect_message',
    // Sets the setter function of updating the selected message in the Chat Section.
    SET_SELECTED_UPDATING: 'set_selected_updating',
    // Sets the setter function of toggling the Side Menu.
    SET_TOGGLE_SIDE_MENU: 'set_toggle_side_menu',
    // Sets the setter function of toggling the blurred state of the Message Section.
    SET_TOGGLE_MESSAGES_BLURRED: 'set_toggle_messages_blurred',
    // Toggles the state of the Side Menu.
    TOGGLE_SIDE_MENU: 'toggle_side_menu'
};

function Reducer(state, { type, payload }) {
    switch (type) {
        case APP_ACTIONS.SELECT_MESSAGE:
            state.UpdateSelected?.(payload.message);
            return {
                ...state,
                selectedMessage: payload.message,
                selectedMessageToggle: payload.Toggle
            };
        case APP_ACTIONS.DESELECT_MESSAGE:
            state.UpdateSelected?.(null);
            state.selectedMessageToggle?.(false);
            return {
                ...state,
                selectedMessage: null,
                selectedMessageToggle: null
            };
        case APP_ACTIONS.SET_SELECTED_UPDATING:
            return {
                ...state,
                UpdateSelected: payload.UpdateSelected
            };
        case APP_ACTIONS.SET_TOGGLE_SIDE_MENU:
            return {
                ...state,
                ToggleSideMenu: payload.ToggleSideMenu
            };
        case APP_ACTIONS.SET_TOGGLE_MESSAGES_BLURRED:
            return {
                ...state,
                ToggleMessagesBlurred: payload.ToggleMessagesBlurred
            };
        case APP_ACTIONS.TOGGLE_SIDE_MENU:
            return {
                ...state,
                isSideMenuOpen: payload.isSideMenuOpen
            };
        default:
            return state;
    }
}

export default function App() {
    const [state, dispatch] = useReducer(Reducer, {});

    DATA.messages.forEach(message => {
        message.time ??= {
            hour: Math.floor(Math.random() * 24),
            minute: Math.floor(Math.random() * 60),
            year: Math.floor(Math.random() * 2) + 2021,
            month: Math.floor(Math.random() * 12),
            day: Math.floor(Math.random() * 31)
        };
    });

    useEffect(() => {
        state.setSelectedMessage?.(state.selectedMessage);
        state.setSelectedMessageChat?.(state.selectedMessage);
    }, [state.selectedMessage]);

    function HandleKeyDown(e) {
        console.log(state);
        if (e.key === 'Escape' && !state.isSideMenuOpen) {
            dispatch({ type: APP_ACTIONS.DESELECT_MESSAGE });
            let page = document.getElementById('page');

            page.tabIndex = 0;
            page.focus();
            page.tabIndex = -1;
        }
    }

    return (
        <div id='page' onKeyDown={HandleKeyDown}>
            <MessageSection messages={DATA.messages} appDispatch={dispatch} ToggleSideMenu={state.ToggleSideMenu} />
            <ChatSection selectedMessage={state.selectedMessage} appDispatch={dispatch} />
            <SideMenu user={DATA.user} appDispatch={dispatch} ToggleMessagesBlurred={state.ToggleMessagesBlurred} />
        </div>
    );
}