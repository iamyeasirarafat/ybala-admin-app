import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { SectionHeading } from '@/components/settings/SectionHeading';
import { Button, Input } from '@/components/ui';
import {
  useAddCartItem,
  useCartItems,
  useCreateOrder,
  useDeleteCartItem,
  useUpdateCartQuantity,
} from '@/hooks/useOrder';
import { useProfile } from '@/hooks/useProfile';
import { useShopSettings, useStoreLocations } from '@/hooks/useSettings';
import {
  AddCartPayload,
  BranchInfo,
  CartLine,
  CreateOrderPayload,
  PaymentMethod,
  ShippingAddress,
  ValidatedCoupon,
} from '@/types';
import { toast } from '@/utils/toast';
import { CartLinesSection } from './CartLinesSection';
import { CouponSection } from './CouponSection';
import {
  CustomerSelectField,
  SelectedCustomer,
} from './CustomerSelectField';
import { DeliveryMethod, DeliverySection } from './DeliverySection';
import { MenuAddSection } from './MenuAddSection';
import { OrderSummary } from './OrderSummary';

const COUNTRY_CODE = '+971';
const stripCode = (phone?: string) =>
  (phone || '').replace(COUNTRY_CODE, '').trim();

const emptyAddress: ShippingAddress = { street: '', city: '', zip: '' };

export const OrderForm: React.FC = () => {
  const router = useRouter();
  const { data: profile } = useProfile();
  const { data: shopSettings } = useShopSettings();
  const { data: storeLocations = [] } = useStoreLocations();

  const addCartItem = useAddCartItem();
  const updateQty = useUpdateCartQuantity();
  const deleteCartItem = useDeleteCartItem();
  const createOrder = useCreateOrder();

  const [customer, setCustomer] = useState<SelectedCustomer | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState('');

  const [method, setMethod] = useState<DeliveryMethod>('delivery');
  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [branchId, setBranchId] = useState<number | null>(null);

  const [cart, setCart] = useState<CartLine[]>([]);
  const [coupons, setCoupons] = useState<ValidatedCoupon[]>([]);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('cash_on_delivery');
  const [deliveryNote, setDeliveryNote] = useState('');

  const isManager = profile?.userType === 'manager';
  const isGuest = customer?.id === 'guest';
  const customerNumericId =
    customer && customer.id !== 'guest' ? customer.id : undefined;

  // Load an existing customer's draft cart when a real customer is picked.
  const { data: existingCart } = useCartItems(customerNumericId);
  useEffect(() => {
    if (existingCart) setCart(existingCart);
  }, [existingCart]);

  const branchOptions = useMemo(
    () =>
      storeLocations.map((s) => ({
        id: s.id,
        name: s.en_title || `Store #${s.id}`,
      })),
    [storeLocations],
  );

  const managerStoreId = useMemo(() => {
    if (!isManager || !profile) return undefined;
    return storeLocations.find((s) => s.manager === profile.id)?.id;
  }, [isManager, profile, storeLocations]);

  const handleCustomer = (c: SelectedCustomer) => {
    setCustomer(c);
    setFirstName(c.first_name || '');
    setLastName(c.last_name || '');
    setPhone(stripCode(c.phone));
    setEmail(c.email || '');
    setCreateAccount(false);
    setPassword('');
    setCoupons([]);
    if (c.id === 'guest') setCart([]);
  };

  const handleAdd = async (
    base: Omit<AddCartPayload, 'created_by' | 'user'>,
  ) => {
    if (!customer) return;
    const payload: AddCartPayload = {
      ...base,
      ...(profile?.id ? { created_by: profile.id } : {}),
      ...(customerNumericId ? { user: customerNumericId } : {}),
    };
    try {
      const line = await addCartItem.mutateAsync(payload);
      setCart((prev) => [...prev, line]);
    } catch {
      // handled by hook
    }
  };

  const handleQty = async (id: number, quantity: number) => {
    setCart((prev) =>
      prev.map((l) => (l.id === id ? { ...l, quantity } : l)),
    );
    try {
      await updateQty.mutateAsync({ id, quantity });
    } catch {
      // handled by hook
    }
  };

  const handleRemove = async (id: number) => {
    setCart((prev) => prev.filter((l) => l.id !== id));
    try {
      await deleteCartItem.mutateAsync(id);
    } catch {
      // handled by hook
    }
  };

  const cartIds = cart.map((l) => l.id);

  const handleSubmit = async () => {
    if (!customer) return toast.error('Please select a customer.');
    if (!firstName.trim()) return toast.error('First name is required.');
    if (!phone.trim()) return toast.error('Phone number is required.');
    if (cart.length === 0) return toast.error('Add at least one item.');

    if (method === 'delivery') {
      if (!address.street.trim() || !address.city.trim() || !address.zip.trim())
        return toast.error('Complete the delivery address.');
    } else if (!branchId) {
      return toast.error('Please select a pickup branch.');
    }

    if (isGuest && createAccount && !password.trim())
      return toast.error('Enter a password for the new account.');

    if (isManager && !managerStoreId)
      return toast.error("You don't belong to any store.");

    const branch = storeLocations.find((s) => s.id === branchId);
    const branchInfo: BranchInfo | undefined =
      method === 'pickup' && branch
        ? {
            id: branch.id,
            en_title: branch.en_title,
            ar_title: branch.ar_title,
            en_map_link: branch.en_map_link,
            ar_map_link: branch.ar_map_link,
            en_wa_link: branch.en_wa_link,
            ar_wa_link: branch.ar_wa_link,
          }
        : undefined;

    const payload: CreateOrderPayload = {
      status: 'pending',
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      customer_phone: `${COUNTRY_CODE}${phone.trim()}`,
      customer_email: email.trim(),
      payment_method: paymentMethod,
      is_pickup: method === 'pickup',
      delivery_note: deliveryNote.trim(),
      cart_ids: cartIds,
      ...(method === 'delivery' ? { shipping_address: address } : {}),
      ...(branchInfo ? { branch_info: branchInfo } : {}),
      ...(coupons.length
        ? { coupon_code: coupons.map((c) => c.code), coupon_data: coupons }
        : {}),
      ...(customerNumericId ? { user_id: customerNumericId } : {}),
      ...(isGuest && createAccount
        ? { create_account: true, password: password.trim() }
        : {}),
      ...(isManager && managerStoreId
        ? { store_location: managerStoreId }
        : {}),
    };

    try {
      await createOrder.mutateAsync(payload);
      router.replace('/(tabs)/orders');
    } catch {
      // handled by hook
    }
  };

  return (
    <View className="px-4 py-5 gap-5">
      <SectionHeading title="New Order" />

      {/* 1. Customer */}
      <CustomerSelectField value={customer} onChange={handleCustomer} />

      {customer && (
        <>
          <View className="gap-3">
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Input
                  label="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="John"
                />
              </View>
              <View className="flex-1">
                <Input
                  label="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Doe"
                />
              </View>
            </View>
            <Input
              label="Phone"
              value={phone}
              onChangeText={setPhone}
              placeholder="50 123 4567"
              keyboardType="phone-pad"
              leftIcon="call-outline"
            />
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="john@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {isGuest && (
              <>
                <View className="flex-row items-center justify-between py-1">
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Create an account for this guest
                  </Text>
                  <Switch
                    value={createAccount}
                    onValueChange={setCreateAccount}
                    trackColor={{ true: '#6FA25F' }}
                  />
                </View>
                {createAccount && (
                  <Input
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="New password"
                    secureTextEntry
                  />
                )}
              </>
            )}
          </View>

          <View className="h-px bg-gray-100 dark:bg-gray-800" />

          {/* 2. Items */}
          <MenuAddSection
            disabled={!customer}
            adding={addCartItem.isPending}
            onAdd={handleAdd}
          />
          <CartLinesSection
            lines={cart}
            onQtyChange={handleQty}
            onRemove={handleRemove}
          />

          <View className="h-px bg-gray-100 dark:bg-gray-800" />

          {/* 3. Fulfilment */}
          <DeliverySection
            method={method}
            onMethodChange={setMethod}
            address={address}
            onAddressChange={setAddress}
            branchId={branchId}
            onBranchChange={setBranchId}
            branchOptions={branchOptions}
          />
          <Input
            label="Delivery Note"
            value={deliveryNote}
            onChangeText={setDeliveryNote}
            placeholder="Optional instructions"
            multiline
            numberOfLines={2}
          />

          <View className="h-px bg-gray-100 dark:bg-gray-800" />

          {/* 4. Payment method */}
          <View>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Method
            </Text>
            <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              {(
                [
                  { key: 'cash_on_delivery', label: 'Cash' },
                  { key: 'stripe', label: 'Card' },
                ] as { key: PaymentMethod; label: string }[]
              ).map((p) => (
                <TouchableOpacity
                  key={p.key}
                  onPress={() => setPaymentMethod(p.key)}
                  className={`flex-1 py-2 rounded-lg items-center ${
                    paymentMethod === p.key ? 'bg-white dark:bg-gray-700' : ''
                  }`}
                  activeOpacity={0.8}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      paymentMethod === p.key
                        ? 'text-primary-600 dark:text-primary-300'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 5. Promo */}
          <CouponSection
            cartIds={cartIds}
            userId={customer.id}
            coupons={coupons}
            onChange={setCoupons}
          />

          <View className="h-px bg-gray-100 dark:bg-gray-800" />

          {/* 6. Summary */}
          <OrderSummary
            lines={cart}
            coupons={coupons}
            isPickup={method === 'pickup'}
            shopSettings={shopSettings}
          />

          <View className="pb-8">
            <Button onPress={handleSubmit} loading={createOrder.isPending}>
              <Text className="text-white font-semibold text-base">
                Create Order
              </Text>
            </Button>
          </View>
        </>
      )}
    </View>
  );
};
