
import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    TextInput,
    TouchableHighlight
} from 'react-native';
import SafeAreaView from "react-native-safe-area-view";
import { Icon } from 'react-native-elements';
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import styles from "./styles";
import 'firebase/firestore';
import firebase from '../../config/firebase'

export default class FormForCS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            status: 'unread'
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentWillMount() {
        let getName;
        let db = firebase.firestore();
        try {
            console.log("uid:>>>>" + firebase.auth().currentUser.uid);
            db.collection("users").doc(firebase.auth().currentUser.uid)
                .get()
                .then(u => {
                    if (u.exists) {
                        if (u.get("displayName") != null) {
                            getName= u.data().displayName
                        }
                    }
                    else {
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.log(">>>>>" + error);

                }).finally(() => {
                    this.setState({ name: getName })
                    console.log(">>>>>success");
                });
            }
            catch (error) {
                console.log(error);
            }
    
        }

    handleSubmit() {
       // var user = firebase.auth().currentUser.type;
        var ticketData = {
            name: this.state.name,
            subject: this.state.subject,
            issuedDate: this.state.issuedDate,
            description: this.state.description,
            status: this.state.status
        }
        this.saveTicket(ticketData);
       
        console.log(this.state.name);
        console.log(this.state.status);
        this.navigateConfirmationPage();
    }

    navigateConfirmationPage = () => {
        this.props.navigation.navigate("Confirmation");
    }
    saveTicket = (ticketData) => {

        const db = firebase.firestore();
        var ticketforCS = db.collection("ticket-for-cs").doc();
        ticketforCS.set(ticketData);
        console.log("Ticket saved successfully");
    }

    onCancel = () => {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.header}>
                        <View style={styles.iconWrapper}>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.openDrawer()}>
                                <Icon
                                    type="material"
                                    name="menu"
                                    size={30}
                                    color="#fff"
                                    containerStyle={styles.drawerIcon}
                                />
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.titleWrapper}>
                            <Text style={styles.textTitle}>Contact Us Form</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.main}>
                <Icon iconStyle={styles.iconStyle} type="material-community" name="account-question-outline" color="#B71C1C" size="77" />
                  
                    <Text style={styles.title}>{"\n"}Name:</Text>
                    <TextInput
                        style={styles.itemInput}
                        onChangeText={name => this.setState({ name })}
                        value={this.state.name}
                    />
                    <Text style={styles.title}>Subject:</Text>
                    <TextInput
                        style={styles.itemInput}
                        onChangeText={subject => this.setState({ subject })}
                        value={this.state.subject}
                    />
                    <Text style={styles.title}>Issued Date:</Text>
                    <TextInput
                        style={styles.itemInput}
                        onChangeText={issuedDate => this.setState({ issuedDate })}
                        value={this.state.issuedDate}
                    />
                    <Text style={styles.title}>Description:</Text>
                    <TextInput
                        style={styles.itemInputforDescription}
                        multiline = {true}
                        numberOfLines = {10}
                        onChangeText={description => this.setState({ description })}
                        value={this.state.description}
                    />
                    <Button title="Submit" onPress={() => this.handleSubmit()} />    
                    <Button title="Cancel" onPress={() => this.onCancel()} />
                </View>
            </SafeAreaView>
        )
    }
}