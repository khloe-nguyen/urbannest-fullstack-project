import React from 'react'
import styled from 'styled-components'
import { FaRegAddressCard } from "react-icons/fa";
const Container = styled.div`
  max-width: 328px;
  min-height: 156px;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 16px;  
  cursor: pointer;
`
const Wrapper = styled.div`
 margin : 10px;
 display: flex;
flex-direction: column;
`

const Icon = styled.div`
flex: 2;
padding:20px 0px;
`

const Title = styled.div`
flex: 1;
  font-weight: bolder;
`
const Description = styled.div`
flex: 1;
`
export default function SettingOption({ iconComponent, title, description }) {

  return (
    <Container>
      <Wrapper>
        <Icon>{iconComponent}</Icon>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Wrapper>
    </Container>
  )
}
