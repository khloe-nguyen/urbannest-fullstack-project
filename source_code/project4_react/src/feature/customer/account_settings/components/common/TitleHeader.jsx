import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const BreadcrumbContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`
const BreadcrumbRoute = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;

    .breadcrum{
        font-weight: bolder;
        color: black;
        text-decoration: none;
    }
  
`
const BreadcrumTitle = styled.div`
    font-weight: 900;
    font-size: 30px;    
`

export default function TitleHeader({ name }) {
    return (
        <div>
            <BreadcrumbContainer>
                <BreadcrumbRoute>
                    <Link to={"/account-settings"} className='breadcrum'>Account</Link>
                    <div>&gt;</div>
                    <div className='breadcrum'>{name}</div>
                </BreadcrumbRoute>
                <BreadcrumTitle>{name}</BreadcrumTitle>
            </BreadcrumbContainer>
        </div>
    )
}
