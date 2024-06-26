import React, { useEffect } from 'react';
import { Heading, Modal, ModalBody, useModal } from '@goosebumps/uikit';
import Page from 'components/Layout/Page';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { setNetworkInfo } from 'state/home';
import { State } from 'state/types';

const HintText = styled.p`
  font-weight: bold;
  font-size: 1.75rem;
  text-align: center;
`

interface Props {
    title?: string,
    onDismiss?: () => void
}

const ComingSoonModal: React.FC<Props> = ({ title, onDismiss, ...props }) => {

    return <Modal title="" maxWidth="380px">
        <Heading textAlign="center">Coming soon</Heading>
    </Modal>
}

const ComingSoon = () => {
    // const history = useHistory();
    // const onDismiss = () => {
    //     history.goBack();
    // }

    // const [onPresentModal] = useModal(<ComingSoonModal onDismiss={onDismiss}/>, false);

    // useEffect(() => {
    //     // onPresentModal();
    // }, [])
    const dispatch = useDispatch();
    const { network } = useSelector((state: State) => state.home)
    useEffect(() => {
        dispatch(setNetworkInfo({ searchKey: "", network }));
    }, [])

    return <Page>
        <HintText>Coming soon</HintText>
    </Page>
}

export default ComingSoon;