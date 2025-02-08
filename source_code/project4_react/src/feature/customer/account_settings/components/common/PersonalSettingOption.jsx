import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    /* border-bottom: solid thin rgb(235,235,235);       */

    .disabled{
        opacity: 0.5;
        cursor: not-allowed;        
    }    
`
const Title = styled.div`
    font-weight: 300;
    font-size: larger;
`
const Description = styled.div`
color: #6A6A6A;
`
const Action = styled.div`
    cursor: pointer;
    font-weight: bolder;
    text-decoration: underline;
`
const Left = styled.div`
    /* margin: 10px 10px 20px 10px; */
`
const Right = styled.div`
    /* margin: 10px 10px 20px 10px; */
`
export default function PersonalSettingOption({ title, description, edit, isDisabled, onActionClick }) {
    return (
        <Container>
            <Left className={isDisabled ? 'disabled' : ''}>                
                <Title>{title}</Title>
                <Description>{description}</Description>
            </Left>
            <Right>
                <Action className={isDisabled ? 'disabled' : ''} onClick={() => onActionClick(pre => !pre)}>{edit}</Action>
            </Right>
        </Container>
    )
}
