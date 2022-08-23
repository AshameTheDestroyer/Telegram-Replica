import React, { useEffect, useState } from 'react';
import { PickRandomColour, PickRandomPhoneNumber, DisplayPhoneNumber, APP_ACTIONS } from './App.js';
import Icon from './Icon.js';
import new_group_icon from './Icons/group.png';
import new_channel_icon from './Icons/speaker.png';
import contacts_icon from './Icons/user.png';
import calls_icon from './Icons/call.png';
import saved_messages_icon from './Icons/saved.png';
import settings_icon from './Icons/settings.png';
import night_mode_icon from './Icons/dark_mode_2.png';
import back_icon from './Icons/arrow.png';
import './side_menu.css';
import { IconButton } from './ChatSection.js';

export default function SideMenu({
    appDispatch = null,
    appState = {},
    user = { name: 'Unknown', iconURL: null, iconColour: null, phone: null },
    isShown = false
}) {
    const [showAccounts, setShowAccount] = useState(false);

    user.iconColour ??= PickRandomColour();
    user.phone ??= PickRandomPhoneNumber();

    useEffect(() => {
        document.querySelector('.side_menu').addEventListener('keydown', HandleKeyDown);
    }, []);

    const menuButtons = [
        { name: 'New Group', iconURL: new_group_icon, iconColour: 'hsl(205, 89%, 65%)' },
        { name: 'New Channel', iconURL: new_channel_icon, iconColour: 'hsl(37, 85%, 53%)' },
        { name: 'Contacts', iconURL: contacts_icon, iconColour: 'hsl(2, 82%, 67%)' },
        { name: 'Calls', iconURL: calls_icon, iconColour: 'hsl(96, 58%, 49%)' },
        { name: 'Saved Messages', iconURL: saved_messages_icon, iconColour: 'hsl(205, 89%, 65%)' },
        { name: 'Settings', iconURL: settings_icon, iconColour: 'hsl(272, 63%, 69%)' },
        { name: 'Night Mode', iconURL: night_mode_icon, iconColour: 'hsl(226, 100%, 73%)' }
    ];

    function HandleKeyDown(e) {
        if (e.key === 'Escape') {
            appDispatch({ type: APP_ACTIONS.TOGGLE_SIDE_MENU, payload: { value: false } });
        }
    }

    function Close() {
        appDispatch({ type: APP_ACTIONS.TOGGLE_SIDE_MENU, payload: { value: false } });
    }

    return (
        <div class='side_menu' style={{
            transform: isShown ? '' : 'translateX(-100%)'
        }}>
            <Header showAccounts={showAccounts} setShowAccount={setShowAccount} user={user} CloseFunction={Close} tabIndex={isShown ? 0 : -1} />
            <AccountsWrapper showAccounts={showAccounts} tabIndex={isShown ? 0 : -1} />
            <ButtonsContainer menuButtons={menuButtons} tabIndex={isShown ? 0 : -1} />
            <Footer showAccounts={showAccounts} tabIndex={isShown ? 0 : -1} />
        </div>
    );
}

function Header({
    showAccounts = false,
    setShowAccount = () => {},
    user = {},
    CloseFunction = () => {},
    tabIndex = 0
}) {
    return (
        <div class='header'>
            <div class='icon_container' onClick={e => setShowAccount(!showAccounts)}>
                <Icon URL={user.iconURL} name={user.name} colour={user.iconColour} fullImage='true' />
            </div>
            <IconButton className='back' iconURL={back_icon} toolTip='Go back to messages.' ApplyOnClick={CloseFunction} tabIndex={tabIndex} />
            <button class='user_data' onClick={e => setShowAccount(!showAccounts)} tabIndex={tabIndex}>
                <div class='data'>
                    <div class='user_name'>{user.name}</div>
                    <div class='user_phone'>{DisplayPhoneNumber(user.phone)}</div>
                </div>
                <abbr class='accounts_toggle_button' title={`${showAccounts ? 'Hide' : 'Show'} available accounts.`} style={{
                    transform: showAccounts ? 'rotateZ(180deg)' : ''
                }}></abbr>
            </button>
        </div>
    );
}

function AccountsWrapper({
    showAccounts = false,
    tabIndex = 0
}) {
    return (
        <div class='accounts_wrapper' style={{
            height: showAccounts ? '45px' : '0',
            paddingTop: showAccounts ? '2px' : '0',
            paddingBottom: showAccounts ? '2px' : '0',
            minHeight: showAccounts ? '' : '0',
            transform: showAccounts ? '' : 'translateY(-1px)'
        }}>
            <button class='accounts_container' tabIndex={showAccounts ? tabIndex : -1}>
                <div class='add_account_button' />Add Account
            </button>
        </div>
    );
}

function ButtonsContainer({
    menuButtons = [],
    tabIndex = 0
}) {
    
    function MenuButton({
        name = 'button',
        iconURL = '',
        iconColour = ''
    }) {
        return (
            <button class='menu_button' tabIndex={tabIndex}>
                <div class='icon' style={{
                    backgroundImage: 'url(' + iconURL + ')',
                    backgroundColor: iconColour
                }} />
                {name}
            </button>
        );
    }

    return (
        <div class='buttons_container'>
            { menuButtons.map((button, i) => <MenuButton key={i} {...button} />) }
        </div>
    );
}

function Footer({
    showAccounts = false,
    tabIndex = 0
}) {
    return (
        <div class='footer' style={{
            transform: showAccounts ? 'translateY(-1px)' : ''
        }}>
            <a href='https://desktop.telegram.org/' tabIndex={tabIndex}>
                Telegram Desktop
            </a>
            <div>
                This Version is EXCLUSIVE for
                <a class='creator' href='https://github.com/AshameTheDestroyer/' tabIndex={tabIndex}>
                    @Griny
                </a>.
            </div>
        </div>
    );
}