import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Mode } from "../App";
import FailedImage from "../assets/failed.png";
import LoserImage from "../assets/loser.png";

type FailureModalProp = {
  failureOpen: boolean;
  onFailureClose: () => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
};

export const FailureModal: React.FC<FailureModalProp> = ({
  failureOpen,
  onFailureClose,
  setMode,
  mode,
}) => {
  const navigate = useNavigate();
  const handleGoPending = () => {
    // @ts-ignore
    if (window.mode === "AloneFailure") {
      setMode("AlonePending");
      // @ts-ignore
      window.mode = "AlonePending";
      // @ts-ignore
    } else if (window.mode === "TogetherFailure") {
      setMode("TogetherPending");
      // @ts-ignore
      window.mode = "TogetherPending";
    } else {
      console.error("ありえないステート");
    }
    onFailureClose();
    navigate("/play");
  };

  return (
    <Modal isOpen={failureOpen} onClose={onFailureClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalBody justifyContent="center">
          <Stack w="full" h="full" justifyContent="center">
            <Flex justifyContent="right">
              <Flex
                h="100px"
                w="100px"
                backgroundImage={LoserImage}
                backgroundSize="100%"
              />
            </Flex>
            <Flex justifyContent="right">
              <Flex
                h="100px"
                w="400px"
                backgroundImage={FailedImage}
                backgroundSize="100%"
              />
            </Flex>
          </Stack>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button colorScheme="blue" mr={3} onClick={handleGoPending}>
            もう一度遊ぶ！
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    // 固定値なので必要なサイズでリサイズする必要あるかも
  );
};
