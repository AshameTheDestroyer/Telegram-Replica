import React, { useEffect } from 'react';
import { IconButton } from './ChatSection.js';
import { APP_ACTIONS, DisplayPhoneNumber } from './App.js';
import './info_menu.css';
import delete_icon from './Icons/delete_2.png';
import info_icon from './Icons/info.png';
import notification_icon from './Icons/notification.png';
import photo_icon from './Icons/image.png';
import video_icon from './Icons/video.png';
import file_icon from './Icons/file.png';
import audio_icon from './Icons/audio.png';
import link_icon from './Icons/link.png';
import voice_icon from './Icons/microphone.png';
import GIF_icon from './Icons/gif.png';
import group_icon from './Icons/group_2.png';
import share_icon from './Icons/share.png';
import edit_icon from './Icons/edit.png';
import trash_icon from './Icons/trash_can.png';
import hand_icon from './Icons/hand.png';
import Icon from './Icon';
import { RenderFull } from './Time.js';

export default function InfoMenu({
    appDispatch = null,
    appState = {},
    isBlurred = false,
    isShown = false
}) {
    useEffect(() => {
        document.querySelector('.info_menu').addEventListener('keydown', HandleKeyDown);
    }, []);

    const MEDIA_BUTTONS = [
        { iconURL: photo_icon, name: 'photo' },
        { iconURL: video_icon, name: 'video' },
        { iconURL: file_icon, name: 'file' },
        { iconURL: audio_icon, name: 'audio file' },
        { iconURL: link_icon, name: 'shared link' },
        { iconURL: voice_icon, name: 'voice message' },
        { iconURL: GIF_icon, name: 'GIF' },
        { iconURL: group_icon, name: 'group in common', sIndex: 5 }
    ];

    const TECHNICAL_BUTTONS = [
        { iconURL: share_icon, name: 'Share this contact' },
        { iconURL: edit_icon, name: 'Edit contact' },
        { iconURL: trash_icon, name: 'Delete contact' },
        { iconURL: hand_icon, name: 'Block user' }
    ];

    function HandleKeyDown(e) {
        if (e.key === 'Escape') { Close(); }
    }

    function Close() {
        appDispatch({ type: APP_ACTIONS.TOGGLE_INFO_MENU, payload: { value: false } });
    }

    function Header() {
        return (
            <div class='header'>
                <div>User Info</div>
                <IconButton iconURL={delete_icon} toolTip='Close info user menu.' tabIndex={isBlurred || !isShown ? -1 : 0} ApplyOnClick={Close} />
                <div class='user_info'>
                    <Icon URL={appState.selectedMessage?.iconURL} name={appState.selectedMessage?.sender.name} colour={appState.selectedMessage?.iconColour} />
                    <div class='user_details'>
                        <div>{appState.selectedMessage?.sender?.name}</div>
                        <div>{appState.selectedMessage && 'last seen at'} {RenderFull(appState.selectedMessage?.sender?.lastSeenTime)}</div>
                    </div>
                </div>
            </div>
        );
    }

    function Details() {
        return (
            <div class='details'>
                <div class='info'>
                    <img class='section_icon' src={info_icon} />
                    <div class='info_details'>
                        <div class='user_phone'>{appState.selectedMessage && DisplayPhoneNumber(appState.selectedMessage?.sender?.phone)}</div>
                        <div>Mobile</div>
                        <div class='user_bio'>{appState.selectedMessage?.sender?.bio}</div>
                        <div>Bio</div>
                    </div>
                </div>

                <div class='notification' tabIndex={isBlurred || !isShown ? -1 : 0}>
                    <img class='section_icon' src={notification_icon} />
                    <div>Notification</div>
                </div>
            </div>
        );
    }

    function InfoButton({
        iconURL = {},
        name = '',
        sIndex = null,
        count = 0
    }) {

        function DisplayName() {
            let arr = [...name];
            arr.splice(sIndex ?? name.length, 0, count > 1 ? 's' : '');
            return arr.join('');
        }

        return (
            <div class='info_button' tabIndex={isBlurred || !isShown ? -1 : 0}>
                <img class='section_icon' src={iconURL} />
                <div>{`${count > -1 ? count : ''} ${DisplayName()}`}</div>
            </div>
        );
    }

    function MediaButtons() {
        return (
            <div class='media_buttons'>
                {MEDIA_BUTTONS.map(mediaButton => <InfoButton key={mediaButton.name} {...mediaButton} />)}
            </div>
        );
    }

    function TechnicalButtons() {
        return (
            <div class='technical_buttons'>
                {TECHNICAL_BUTTONS.map(technicalButton => <InfoButton key={technicalButton.name} iconURL={technicalButton.iconURL} name={technicalButton.name} sIndex={technicalButton.sIndex} count={-1} />)}
            </div>
        );
    }

    return (
        <div class='info_menu' style={{
            transform: isShown && appState.selectedMessage ? '' : 'translateX(100%)',
            position: isShown && appState.selectedMessage ? '' : 'absolute',
            right: isShown && appState.selectedMessage ? '' : 0,
            resize: !isBlurred && isShown && appState.selectedMessage ? '' : 'none',
            opacity: !isBlurred && isShown && appState.selectedMessage ? 1 : 0
        }}>
            <div>
                <Header />
                <Details />
                <MediaButtons />
                <TechnicalButtons />
            </div>
        </div>
    );
}