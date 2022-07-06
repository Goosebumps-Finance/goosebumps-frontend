import { Button, Flex } from '@goosebumps/uikit';
import React from 'react';
import styled from 'styled-components';
import HomePageText from "../home.json";

const SectionContainer = styled.div`
    display: flex;
    align-items: center;
    background-size: cover;
    margin: auto;
    height: 100%;
    color: white;
`

const PortfolioSection = () => {
    const styles = {
        title: {
            fontSize: "48px",
            marginBottom: "25px",
            lineHeight: "1.2"
        },
        abstract: {
            fontSize: "17px",
            lineHeight: "27px",
            marginBottom: "15px"
        },
        subtitle: {
            lineHeight: "1.2",
            marginBottom: "0.5rem"
        },
        description: {
            fontSize: "14px",
            lineHeight: "27px"
        }
    }
    return (
    <SectionContainer>
        <Flex flex={1} style={{justifyContent:"flex-end"}}>
            <img src="/images/goosebumps/2portfolio.png" alt="portfolio tracker" />
        </Flex>
        <Flex flexDirection="column" flex={1} >
            <div style={{marginTop: "30px", maxWidth: "620px", marginLeft: "auto"}}>
                <div style={{ fontWeight: "bold", ...styles.title}}>{HomePageText.section2.title}</div>
            </div>
            <p style={styles.abstract}>{HomePageText.section2.abstract}</p>
            <div>
                <h5 style={styles.subtitle}>{HomePageText.section2.subtitle1}</h5>
                <p style={styles.description}>{HomePageText.section2.description1}</p>
            </div>
            <div>
                <h5 style={styles.subtitle}>{HomePageText.section2.subtitle2}</h5>
                <p style={styles.description}>{HomePageText.section2.description2}</p>
            </div>
        </Flex>
    </SectionContainer>
    )
}

export default PortfolioSection;