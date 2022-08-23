import React, { useState } from 'react';
import Time from './Time.js';
import './message.css';
import clock_icon from './Icons/clock.png';
import checked_icon from './Icons/checked.png';
import double_checked_icon from './Icons/double_checked.png';
import { MESSAGE_SECTION_ACTIONS } from './MessageSection.js';
import Icon from './Icon.js';

export default function Message({
    appDispatch = null,
    sectionDispatch = null,
    message = null,
    sender = { name: 'unknown', phone: '+963 000 000 000', bio: '...' },
    content = 'Hello.',
    iconURL = '',
    time = { hour: 12, minute: 0, year: 2022, month: 1, day: 1 },
    read = false,
    arrived = true,
    recieved = false,
    messagesCount = 1,
    iconColour = null,
    includesHeart = false,
    selected = false,
    archived = false,
    blank = false,
    isBlurred = false,
    draftMessage = null
}) {
    if (message) { SetUp(); }
    const [isSelected, setSelected] = useState(selected);

    let senderName = sender.name.substring(0, 50);

    function SetUp() {
        sender = message.sender ?? sender;
        content = message.content ?? content;
        iconURL = message.iconURL ?? iconURL;
        time = message.time ?? time;
        read = message.read ?? read;
        arrived = message.arrived ?? arrived;
        recieved = message.recieved ?? recieved;
        messagesCount = message.messagesCount ?? messagesCount;
        iconColour = message.iconColour ?? iconColour;
        includesHeart = message.includesHeart ?? includesHeart;
        selected = message.selected ?? selected;
        archived = message.archived ?? archived;
        blank = message.blank ?? blank;
        draftMessage = message.draftMessage ?? draftMessage;
    }

    function ToggleSelection(value) {
        setSelected(value);
        if (!value) { return; }
        sectionDispatch?.({ type: MESSAGE_SECTION_ACTIONS.SELECT, payload: { message: message, Toggle: ToggleSelection, appDispatch: appDispatch } });
    }
    
    return (
        <div class='message' tabIndex={isBlurred ? -1 : 0} style={{
            backgroundColor: isSelected ? 'hsl(var(--selection-colour))' : ''
        }} onFocus={e => ToggleSelection(true)}>
            <Icon URL={iconURL} name={senderName} colour={iconColour} />
            <div class='displayer'>
                <abbr class='sender' title={senderName}>{senderName}</abbr>
                <div class='time_container'>
                    { !blank && <Time time={time} isSelected={isSelected} /> }
                    {
                        !recieved && !draftMessage && !blank &&
                        <abbr title={ !arrived ? 'Waiting for network...' : !read ? 'Arrived but hasn\'t been read yet.' : 'Has been read.' }>
                            <img src={ !arrived ? clock_icon : !read ? checked_icon : double_checked_icon }
                                alt={ !arrived ? 'cl' : !read ? 'ch' : 'dc' } style={{
                                    filter: isSelected ? 'none' : ''
                                }}/>
                        </abbr>
                    }
                </div>
                <div class='content_displayer'>
                    {draftMessage && <div class='draft_indicator'>draft</div>}
                    <abbr class='content' title={draftMessage || content} style={{
                        color: isSelected ? 'white' : ''
                    }}>{draftMessage || content}</abbr>
                </div>
                <div class='indicators'>
                    {
                        includesHeart && !blank &&
                        <abbr class='heart_indicator' title='A message of yours is got hearted.'></abbr>
                    }
                    {
                        recieved && messagesCount > 0 && !read && !draftMessage && !blank &&
                        <abbr class='messages_indicator' title={messagesCount + ' unread messages.'}>
                            { messagesCount <= 9 && messagesCount }
                        </abbr>
                    }
                </div>
            </div>
        </div>
    );
}