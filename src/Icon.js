import React from 'react';
import './icon.css';

export default function Icon({
    URL = '',
    name = 'Unknown',
    colour = null,
    fullImage = false
}) {
  return (
    <button class='icon' style={{ '--bg-colour' : colour }} tabindex='-1'>
        { ((URL) && <img src={URL} alt={name} style={{ width: fullImage ? '' : '75%' }} />) || name[0] }
    </button>
  );
}
