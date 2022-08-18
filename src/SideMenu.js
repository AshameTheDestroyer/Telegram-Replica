import React, { createElement, useEffect, useRef, useState } from 'react';
import { PickRandomColour, APP_ACTIONS } from './App.js';
import Icon from './Icon.js';
import new_group_icon from './Icons/group.png';
import new_channel_icon from './Icons/speaker.png';
import contacts_icon from './Icons/user.png';
import calls_icon from './Icons/call.png';
import saved_messages_icon from './Icons/saved.png';
import settings_icon from './Icons/settings.png';
import night_mode_icon from './Icons/dark_mode_2.png';
import './side_menu.css';

export default function SideMenu({
    appDispatch = null,
    user = { name: 'Unknown', iconURL: null, iconColour: null, phone: null },
    ToggleMessagesBlurred = () => {}
}) {
    const [showAccounts, setShowAccount] = useState(false);
    const [isShown, setShown] = useState(false);
    const menuRef = new useRef();
    
    user.iconColour ??= PickRandomColour();
    user.phone ??= +('963' + Math.random()).replace('.', '').substring(0, 12);

    const menuButtons = [
        { name: 'New Group', iconURL: new_group_icon, iconColour: 'hsl(205, 89%, 65%)' },
        { name: 'New Channel', iconURL: new_channel_icon, iconColour: 'hsl(37, 85%, 53%)' },
        { name: 'Contacts', iconURL: contacts_icon, iconColour: 'hsl(2, 82%, 67%)' },
        { name: 'Calls', iconURL: calls_icon, iconColour: 'hsl(96, 58%, 49%)' },
        { name: 'Saved Messages', iconURL: saved_messages_icon, iconColour: 'hsl(205, 89%, 65%)' },
        { name: 'Settings', iconURL: settings_icon, iconColour: 'hsl(272, 63%, 69%)' },
        { name: 'Night Mode', iconURL: night_mode_icon, iconColour: 'hsl(226, 100%, 73%)' }
    ];
    
    useEffect(() => {
        appDispatch?.({ type: APP_ACTIONS.SET_TOGGLE_SIDE_MENU, payload: { ToggleSideMenu: ToggleSideMenu, IsSideMenuOpen: IsSideMenuOpen } });
    }, []);

    function ToggleSideMenu(value) {
        setShown(value);
        appDispatch?.({ type: APP_ACTIONS.TOGGLE_SIDE_MENU, payload: { isSideMenuOpen: value } });

        if (value) {
            menuRef.current.tabIndex = 0;
            menuRef.current.focus();
            menuRef.current.tabIndex = -1;
        }
    }

    function IsSideMenuOpen() { return showAccounts; }

    function DisplayPhone(phone) {
        let result = '+';
        Array.from((phone + '')).forEach((c, i) => {
            result += c;
            if ((i + 1) % 3 === 0) { result += ' '; }
        });
        return result;
    }

    function CloseSideMenu() {
        setShown(false);
        ToggleMessagesBlurred?.(false);
    }

    function Header() {
        return (
            <div class='header' onKeyDown={HandleKeyDown}>
                <div class='icon_container' onClick={e => setShowAccount(!showAccounts)}>
                    <Icon URL={user.iconURL} name={user.name} colour={user.iconColour} fullImage='true' />
                </div>
                <button class='user_data' onClick={e => setShowAccount(!showAccounts)} tabIndex={isShown ? 0 : -1}>
                    <div class='data'>
                        <div class='user_name'>{user.name}</div>
                        <div class='user_phone'>{DisplayPhone(user.phone)}</div>
                    </div>
                    <div class='accounts_toggle_button' style={{
                        transform: showAccounts ? 'rotate(180deg)' : 'rotate(0)',
                    }}></div>
                </button>
            </div>
        );
    }

    function MenuButton({
        name = 'button',
        iconURL = '',
        iconColour = ''
    }) {
        return (
            <button class='menu_button' tabIndex={isShown ? 0 : -1}>
                <div class='icon' style={{
                    backgroundImage: 'url(' + iconURL + ')',
                    backgroundColor: iconColour
                }} />
                {name}
            </button>
        );
    }

    function HandleKeyDown(e) {
        if (e.key === 'Escape') { ToggleSideMenu(false); }
    }

    return (
        <>
            <div class='black_cover' style={{
                opacity: isShown ? '' : 0,
                visibility: isShown ? '' : 'hidden'
            }} onClick={CloseSideMenu} />

            <div ref={menuRef} class='side_menu' style={{
                transform: isShown ? '' : 'translateX(-100%)'
            }} onKeyDown={HandleKeyDown}>
                <Header />
                <div class='accounts_wrapper' style={{
                    height: showAccounts ? 'calc(var(--font-size) + 30px)' : '0px',
                    paddingTop: showAccounts ? '7.5px' : '0',
                    paddingBottom: showAccounts ? '7.5px' : '0',
                    transform: showAccounts ? '' : 'translateY(-1px)'
                }}>
                    <button class='accounts_container' tabIndex={ isShown && showAccounts ? 0 : -1 }>
                        <div class='add_account_button' />Add Account
                    </button>
                </div>
                <div class='buttons_container'>
                    { menuButtons.map((button, i) => <MenuButton key={i} name={button.name} iconURL={button.iconURL} iconColour={button.iconColour} />) }
                    <div class='footer'>
                        <a url='https://desktop.telegram.org/'>Telegram Desktop</a>
                        <br />
                        <div>This Version is EXCLUSIVE for <a class='creator' link='https://youtube.com/'>@Griny</a>.</div>
                    </div>
                </div>
            </div>
        </>
    );
}
