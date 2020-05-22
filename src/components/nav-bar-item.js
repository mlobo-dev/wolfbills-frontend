import React from 'react'

function NavbarItem({ render, ...props }) {
    if (render) {
        return (
            <li className="nav-item">
                <a
                    className="nav-link"
                    href={props.href}
                    onClick={props.onClick}
                >{props.label}

                </a>
            </li>
        )
    } else {
        return false;
    }
}

export default NavbarItem;