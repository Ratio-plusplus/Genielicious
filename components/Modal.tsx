import { 
    Modal as RNModal, 
    ModalProps, 
    KeyboardAvoidingView,
    View,
    Platform,
    StyleSheet,
    } from "react-native";

type PROPS = ModalProps & {
    isOpen: boolean
    withInput?: boolean
}

export const Modal = ({ isOpen, withInput, children, ...rest }: PROPS) => {
    const content = withInput ? (
        <KeyboardAvoidingView
            style = {styles.KeyboardAvoidingView} 
            behavior={ Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {children}
        </KeyboardAvoidingView>
    ) : (
        <View style={styles.viewContainer}>
            {children}
        </View>
    )
        
    

    return (
        <RNModal
            visible={isOpen}
            transparent
            animationType = "fade"
            statusBarTranslucent
            {...rest}
        >
            {content}
        </RNModal>
    )
}

const styles = StyleSheet.create({
    KeyboardAvoidingView:{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(51, 51, 51, 0.25)',
    },
    viewContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(51, 51, 51, 0.25)',
    },

})