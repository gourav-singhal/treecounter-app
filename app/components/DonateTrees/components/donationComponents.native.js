import React from 'react';
import { Image, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getImageUrl } from '../../../actions/apiRouting';
import { currencyIcon, infoHint, nextArrowWhite } from '../../../assets';
import { updateStaticRoute } from '../../../helpers/routerHelper';
import styles from '../../../styles/donations/donationDetails';
import { formatNumber } from '../../../utils/utils';
import UserProfileImage from '../../Common/UserProfileImage.native';

export function TaxReceipt(props) {
  let { taxReceiptSwitch, toggleTaxReceipt } = props;
  return (
    <View style={styles.isTaxDeductibleView}>
      <View>
        <Text style={styles.isTaxDeductibleText}>
          Send me a tax deduction receipt for
        </Text>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={styles.isTaxDeductibleCountry}>Germany</Text>
          <Icon name={'chevron-down'} size={14} color="#89b53a" />
        </TouchableOpacity>
      </View>

      <Switch
        style={styles.isTaxDeductibleSwitch}
        onValueChange={toggleTaxReceipt}
        value={taxReceiptSwitch}
      />
    </View>
  );
}

export function CoverFee(props) {
  return (
    <View style={styles.coverCommissionView}>
      <Text style={styles.coverCommissionText}>
        Help {props.selectedProject.tpoSlug} cover the credit card fee of{' '}
        {formatNumber(
          props.treeCount / 100 * 2.9 + 0.3,
          null,
          props.selectedCurrency
        )}{' '}
      </Text>
      <Switch
        style={styles.coverCommissionSwitch}
        onValueChange={props.toggleSetCommission}
        trackColor={{ false: '#f2f2f7', true: '#88b439' }}
        value={props.commissionSwitch}
      />
    </View>
  );
}

export function PaymentOption(props) {
  return (
    <View style={styles.bottomButtonView}>
      <View style={styles.leftSection}>
        <View style={styles.paymentTreeDetails}>
          <Text style={styles.paymentTreeAmount}>
            {formatNumber(
              props.commissionSwitch
                ? props.treeCost * props.treeCount +
                (props.treeCount / 100 * 2.9 + 0.3)
                : props.treeCost * props.treeCount,
              null,
              props.selectedCurrency
            )}
          </Text>
          <Text style={styles.paymentTreeCount}>
            for {props.treeCount} trees
          </Text>
        </View>

        {/* <TouchableOpacity style={styles.otherPaymentButton}>
            <Text style={styles.otherPaymentText}>Other payment methods</Text>
          </TouchableOpacity> */}
        <View>
          <Text style={styles.otherPaymentText}>Click Continue to proceed</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          updateStaticRoute('donor_details_form', props.navigation, {
            treeCount: props.treeCount,
            treeCost: props.treeCost,
            selectedCurrency: props.selectedCurrency,
            commissionSwitch: props.commissionSwitch,
            navigation: props.navigation
          });
        }}
        style={styles.continueButtonView}
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            style={{ maxHeight: 24 }}
            source={nextArrowWhite}
            resizeMode="contain"
          />
          <Text style={styles.continueButtonText}>Continue</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export function SelectFrequency(props) {
  let frequencyOptions = [
    { label: 'One Time', value: 'once' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' }
  ];
  return (
    <>
      <Text
        style={{
          fontFamily: 'OpenSans-SemiBold',
          fontSize: 12,
          lineHeight: 17,
          letterSpacing: 0,
          textAlign: 'left',
          color: '#4d5153',
          marginTop: 30
        }}
      >
        FREQUENCY
      </Text>
      <View style={styles.repititionSelector}>
        {frequencyOptions.map(option => (
          <TouchableOpacity
            onPress={() => props.setFrequency(option.value)}
            style={
              props.frequency === option.value
                ? styles.repititionSelectedView
                : styles.repititionSelectorView
            }
          >
            <Text
              style={
                props.frequency === option.value
                  ? styles.selectedRepititionText
                  : styles.repititionText
              }
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

export function PlantProjectDetails(props) {
  return (
    <View style={styles.projectDetails}>
      <Image
        style={styles.projectImage}
        source={{
          uri: getImageUrl('project', 'thumb', props.selectedProject.image)
        }}
      />
      <View style={styles.projectNameAmount}>
        <Text style={styles.projectName}>{props.selectedProject.name}</Text>
        <View style={styles.projectAmountView}>
          <Image style={styles.projectAmountImage} source={currencyIcon} />
          <Text style={styles.projectAmountText}>
            {formatNumber(props.treeCost, null, props.selectedCurrency)} per
            tree
          </Text>
        </View>
      </View>
    </View>
  );
}

export function NoPlantProjectDetails(props) {
  return (
    <TouchableOpacity style={styles.noprojectDetails}>
      <View style={styles.noprojectImage} />
      <View style={styles.noprojectNameAmount}>
        <Text style={styles.noprojectName}>Select Project</Text>
        <Text style={styles.noprojectAmountText}>
          Tap here to view all projects
        </Text>
      </View>
      <View style={[{ alignSelf: 'auto', marginRight: 16 }]}>
        <Icon name={'chevron-right'} size={14} color="#4d5153" />
      </View>
    </TouchableOpacity>
  );
}

export function SelectTreeCount(props) {
  const [customTreeCount, setCustomTreeCount] = React.useState(false);
  const [tempTreeCount, setTempTreeCount] = React.useState(0);
  let treeCountOptions;

  if (props.selectedProject) {
    if (
      props.selectedProject.paymentSetup.treeCountOptions &&
      props.selectedProject.paymentSetup.treeCountOptions.fixedTreeCountOptions
    ) {
      treeCountOptions =
        props.selectedProject.paymentSetup.treeCountOptions
          .fixedTreeCountOptions;
    } else {
      treeCountOptions = [10, 20, 50, 150];
    }
  }

  return (
    <View style={styles.treeCountSelector}>
      {treeCountOptions.map(option => (
        <TouchableOpacity
          onPress={() => {
            props.setTreeCount(option);
            setCustomTreeCount(false);
          }}
          style={
            props.treeCount === option
              ? styles.selectedView
              : styles.selectorView
          }
        >
          <Text
            style={
              props.treeCount === option
                ? styles.selectedTreeCountText
                : styles.treeCountText
            }
          >
            {option} Trees
          </Text>
        </TouchableOpacity>
      ))}
      {customTreeCount ? (
        <View style={styles.customSelectedView}>
          <TextInput
            style={
              customTreeCount
                ? styles.treeCountTextInputSelected
                : styles.treeCountTextInput
            }
            onChangeText={treeCount => setTempTreeCount(treeCount)}
            onSubmitEditing={() => props.setTreeCount(tempTreeCount)}
            value={tempTreeCount}
            keyboardType={'number-pad'}
            autoFocus
          />
          <Text
            style={
              customTreeCount
                ? styles.treeCountNumberSelected
                : styles.treeCountNumber
            }
          >
            Trees
          </Text>
        </View>
      ) : (
          <TouchableOpacity
            onPress={() => {
              setCustomTreeCount(true);
              props.setTreeCount('');
            }}
            style={styles.customSelectorView}
          >
            <Text style={styles.customTreeCountText}>Custom Trees</Text>
          </TouchableOpacity>
        )}
    </View>
  );
}


const hintCard = () => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        marginTop: 24,
        borderRadius: 6,
        backgroundColor: '#F5F7F9',
        alignItems: 'center'
      }}
    >
      <View
        style={{
          backgroundColor: '#89b53a',
          width: 6,
          height: '100%',
          borderTopLeftRadius: 6,
          borderBottomLeftRadius: 6
        }}
      />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginLeft: 24,
          paddingTop: 24,
          paddingBottom: 24,
          alignItems: 'center',
          paddingRight: 24
        }}
      >
        <Image
          source={infoHint}
          style={{ marginRight: 12, height: 24, width: 24 }}
        />
        <Text style={{ maxWidth: '90%', fontFamily: 'OpenSans-Regular' }}>
          Please select Tree Count to Donate trees.
              </Text>
      </View>
    </View>
  )
}

export const UserContactDetails = (props) => {
  let { donorDetails } = props
  return (
    <>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>CONTACT DETAILS</Text>
        <TouchableOpacity>
          {donorDetails.firstName ? <Text style={styles.sectionRightButton}>Edit</Text> : <Text style={styles.sectionRightButton}>Add</Text>}
        </TouchableOpacity>
      </View>
      {donorDetails.firstName ?
        <View>
          <Text style={styles.contactDetailsAddress}>{donorDetails.firstName} {donorDetails.lastName}</Text>
          {donorDetails.companyName ? (
            <Text style={styles.contactDetailsAddress}>{donorDetails.companyName}</Text>
          ) : null}
          <Text style={styles.contactDetailsAddress}>
            {donorDetails.email}
          </Text>
          <Text style={styles.contactDetailsAddress}>{donorDetails.country}</Text>
        </View> : null}
    </>
  )
}

export const UserPaymentDetails = (props) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>
      <TouchableOpacity>
        <Text style={styles.sectionRightButton}>Change</Text>
      </TouchableOpacity>
    </View>
  )
}

export const PaymentsProcessedBy = (props) => {
  return (
    <Text style={styles.paymentProcessText}>
      Your payment will be processed either by Stripe, Plant-for-the-Planet,{' '}
      {props.selectedProject.tpoSlug === 'plant-for-the-planet'
        ? null
        : 'or ' + props.selectedProject.tpoSlug}{' '}
          if is stripe connected.
    </Text>
  )
}

export const SupportUserDetails = (props) => {
  return (
    <View>
      <View style={[{ marginTop: 20, marginBottom: 0 }]}><Text style={styles.sectionTitle}>SUPPORT</Text>
        <View style={styles.supportUser}>
          <UserProfileImage
            profileImage={
              props.context.support && props.context.support.treecounterAvatar
            }
            imageStyle={{ width: 40, height: 40, borderRadius: 40 / 2 }}
          />
          <View style={styles.supportUserNameContainer}>
            <Text style={styles.supportUserName}>{props.context.support.displayName}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
