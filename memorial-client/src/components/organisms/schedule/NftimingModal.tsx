import {
    CheckboxGroup,
    Checkbox,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    ModalFooter,
    HStack,
    FormControl,
    Stack
} from "@chakra-ui/react";

import { Dispatch, memo, SetStateAction, useState, VFC } from "react";
import { PrimaryButton } from "../../atoms/button/PrimaryButton";
import { SecondaryButton } from "../../atoms/button/SecondaryButton";
  
type Props = {
    isOpen: boolean;
    onClose: () => void;
    nfTiming: Array<string>;
    setNfTiming:  Dispatch<SetStateAction<Array<string>>>
};
  
export const NftimingModal: VFC<Props> = memo((props) => {
    const { isOpen, onClose, nfTiming, setNfTiming } = props;
    const [ modalNfTiming, setModalNftiming ] = useState<Array<string>>([]);

    const onClickClose = () => {
        setNfTiming(nfTiming);
        onClose();
    }
    const onClickRegistNftiming = () => {
        setNfTiming(modalNfTiming);
        onClose();
    }
    const onChangeCheckGroup = (value:Array<string>) => {
        value.sort()
        setModalNftiming(value)
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} isCentered>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>通知設定日</ModalHeader>
            <ModalCloseButton />
            <ModalBody mx={4}>
                <FormControl id="nftiming">
                    <CheckboxGroup onChange={onChangeCheckGroup} colorScheme="blue" defaultValue={nfTiming}>
                        <Checkbox my={2} value="0" >当日</Checkbox><br />
                        <Checkbox my={2} value="1" >１日前</Checkbox><br />
                        <Checkbox my={2} value="2" >１週間前</Checkbox><br />
                        <Checkbox my={2} value="3" >１か月前</Checkbox><br />
                    </CheckboxGroup>            
                </FormControl>
            </ModalBody>
            <ModalFooter>
                <HStack>
                <SecondaryButton onClick={onClickClose}>
                    閉じる
                </SecondaryButton>
                <PrimaryButton type="button" onClick={onClickRegistNftiming}>
                    完了
                </PrimaryButton>
                </HStack>
            </ModalFooter>
        </ModalContent>
        </Modal>
    );
});
  