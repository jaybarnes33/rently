// Component Usage

// import React, { useState } from "react";
// import { Text } from "react-native";
// import { ModalSheet } from './ModalSheet';

// export const MyApp: React.FC = () => {
//   const [modalVisible, setModalVisible] = useState(false);

//   const toggleModal = () => {
//     setModalVisible(!modalVisible);
//   };

//   return (
//     <ModalSheet
//       modalButton={
//         <Pressable onPress={toggleModal}>
//           <Text className="font-bold">Show Modal</Text>
//         </Pressable>
//       }
//       isVisible={modalVisible}
//       toggleModal={toggleModal}
//     >
//       <Text className="text-2xl my-4">Hello World!</Text>
//     </ModalSheet>
//   );
// };

import React, { ReactNode } from "react";
import { Modal, View } from "react-native";

interface ModalSheetProps {
  isVisible: boolean;
  toggleModal: () => void;
  children: ReactNode;
  modalButton: ReactNode;
}

export const ModalSheet: React.FC<ModalSheetProps> = ({
  isVisible,
  toggleModal,
  children,
  modalButton,
}) => {
  return (
    <View>
      <Modal
        animationType="slide"
        visible={isVisible}
        presentationStyle="pageSheet"
        onRequestClose={() => {
          toggleModal();
        }}
      >
        <View className="bg-white">{children}</View>
      </Modal>
      {modalButton}
    </View>
  );
};
