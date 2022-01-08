import {
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
import { DeleteIcon } from '@chakra-ui/icons'

import { memo, VFC, Dispatch, SetStateAction } from "react";
import { PrimaryButton } from "../../atoms/button/PrimaryButton";
import { SecondaryButton } from "../../atoms/button/SecondaryButton"
import { useDeleteSchedule } from "../../../hooks/api/useDeleteSchedule";
  
type Props = {
    isOpen: boolean;
    onClose: () => void;
    id: number;
};
  
export const DeleteConfirmModal: VFC<Props> = memo((props) => {
    const { isOpen, onClose, id } = props;
    const { deleteSchedule } = useDeleteSchedule();

    const onClickDeleteConfirm = () => {
        deleteSchedule(id);
        onClose();
    }
    
return (
    <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} isCentered>
    <ModalOverlay />
    <ModalContent>
        <ModalHeader><DeleteIcon />&nbsp;&nbsp;削除確認</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            本当に削除してもよろしいですか？
        </ModalBody>
        <ModalFooter>
            <HStack>
            <SecondaryButton onClick={() => onClose()}>
                閉じる
            </SecondaryButton>
            <PrimaryButton type="button" onClick={onClickDeleteConfirm}>
                はい
            </PrimaryButton>
            </HStack>
        </ModalFooter>
    </ModalContent>
    </Modal>
);
});
  