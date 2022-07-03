import { Button, Flex } from '@pancakeswap/uikit';
import React from 'react';
import styled from 'styled-components';

const SectionContainer = styled.div`
    display: flex;
    justify-content: space-between;
    background-image: url("/images/goosebumps/1banner-bg.jpg");
    background-position: center center;
    background-size: cover;
    padding-top: 200px;
    margin-top: -140px;
    height: 100%;
    color: white;
`

const BannerSection = () => {
    return (
        <SectionContainer>
            <Flex flexDirection="column" flex={1} >
                <div style={{marginTop: "30px", maxWidth: "620px", marginLeft: "auto"}}>
                    <div style={{
                        fontSize: "58px",
                        fontWeight: "bold",
                        marginBottom: "30px",
                        lineHeight: "1.2"
                    }}>Manage Your Crypto and Portfolio From One Place</div>
                    <p style={{marginBottom: "40px"}}>Goosebumps powered by Empire Token is a decentralized exchange with a unique portfolio tracking and charting system.</p>
                    <div>
                        <Button variant="secondary" m="5px">Portfolio Tracker</Button>
                        <Button variant="secondary" m="5px">Charts</Button>
                        <Button variant="secondary" m="5px">Stake</Button>
                        <Button variant="secondary" m="5px">DEX</Button>
                    </div>
                </div>
            </Flex>
            <Flex flex={1} style={{justifyContent:"flex-end"}}>
                <img src="/images/goosebumps/1banner-img.png" alt="portfolio tracker" />
            </Flex>
        </SectionContainer>
    )
}

export default BannerSection;