import {
    FormControl,
    Textarea,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Stack,
    HStack,
    ModalFooter
} from "@chakra-ui/react";

import { memo, VFC, useState, ChangeEvent, Dispatch, SetStateAction } from "react";
import { PrimaryButton } from "../../atoms/button/PrimaryButton";
import { SecondaryButton } from "../../atoms/button/SecondaryButton"
  
type Props = {
    isOpen: boolean;
    onClose: () => void;
    memoVal: string | undefined;
    setMemoVal:  Dispatch<SetStateAction<string | undefined>>
};
  
export const MemoModal: VFC<Props> = memo((props) => {
    const { isOpen, onClose, memoVal, setMemoVal } = props;
    const [ modalMemoVal, setModalMemoVal ] = useState<string>();

    const onClickClose = () => {
        setMemoVal(memoVal)
        onClose();
    }
    const onClickRegistNftiming = () => {
        setMemoVal(modalMemoVal)
        onClose();
    }
    const onChangeMemo = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setModalMemoVal(e.target.value)
    }

    
return (
    <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} isCentered>
    <ModalOverlay />
    <ModalContent>
        <ModalHeader>メモ</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        <Stack spacing={4}>
            <FormControl>
            <Textarea defaultValue={memoVal} onChange={onChangeMemo}/>
            </FormControl>
        </Stack>
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
  