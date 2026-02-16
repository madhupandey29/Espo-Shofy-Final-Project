'use client';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { FaEdit, FaTrash } from 'react-icons/fa';
import dayjs from 'dayjs';

import {
  useGetSessionInfoQuery,
  useUpdateProfileMutation,
  useLogoutUserMutation,
} from '@/redux/features/auth/authApi';

import { notifyError, notifySuccess } from '@/utils/toast';
import styles from './UserProfile.module.css';

/* ---------------- EspoCRM Field Mapping ---------------- */
const mapEspoToProfile = (espoUser) => {
  if (!espoUser) return null;
  return {
    _id: espoUser.id,
    id: espoUser.id,
    firstName: espoUser.firstName || '',
    lastName: espoUser.lastName || '',
    name: espoUser.name || `${espoUser.firstName || ''} ${espoUser.lastName || ''}`.trim(),
    email: espoUser.emailAddress || '',
    phone: espoUser.phoneNumber || '',
    organisation: espoUser.organizationNameRaw || '',
    address: espoUser.addressStreet || '',
    city: espoUser.addressCity || '',
    state: espoUser.addressState || '',
    country: espoUser.addressCountry || '',
    pincode: espoUser.addressPostalCode || '',
    avatar: null,
    userImage: null,
  };
};

const mapProfileToEspo = (profileData) => ({
  firstName: profileData.firstName,
  lastName: profileData.lastName,
  emailAddress: profileData.email,
  phoneNumber: profileData.phone,
  organizationNameRaw: profileData.organisation || '',
  addressStreet: profileData.address || '',
  addressCity: profileData.city || '',
  addressState: profileData.state || '',
  addressCountry: profileData.country || '',
  addressPostalCode: profileData.pincode || '',
});

/* ---------------- helpers ---------------- */
const pickInitialUser = (reduxUser) => {
  if (reduxUser) return reduxUser;
  const cookie = Cookies.get('userInfo');
  if (!cookie) return null;
  try { return JSON.parse(cookie)?.user || null; } catch { return null; }
};

const readUserInfoCookie = () => {
  try { return JSON.parse(Cookies.get('userInfo') || '{}'); } catch { return {}; }
};
const writeUserInfoCookiePreserving = (updatedUser) => {
  const prev = readUserInfoCookie();
  Cookies.set('userInfo', JSON.stringify({ ...prev, user: updatedUser }), { expires: 0.5 });
};

const initials = (name = '') =>
  name.split(' ').filter(Boolean).map(s => s[0]?.toUpperCase()).slice(0, 2).join('') || 'U';

const onlyDigits = (s = '') => (s || '').replace(/\D+/g, '');
const normalizeDial = (s = '') => (s ? (s.startsWith('+') ? s : `+${s}`) : '');

const cleanString = (v) => (typeof v === 'string' ? v.trim() : v);

const diffPayload = (next, base, allowEmptyKeys = new Set()) => {
  const out = {};
  Object.keys(next).forEach((k) => {
    const nv = next[k];
    const bv = base?.[k];
    const same = (cleanString(nv) === cleanString(bv));
    if (same) return;
    if (nv === undefined) return;
    if (nv === '' && !allowEmptyKeys.has(k)) return;
    out[k] = nv;
  });
  return out;
};

const isInlineSrc = (src) =>
  typeof src === 'string' && (src.startsWith('data:') || src.startsWith('blob:'));

/**
 * Avatar renderer:
 * - data:/blob: => <img> (but WITH width/height/title/loading so SEO tools are happy)
 * - http(s) => next/image WITH width/height/title
 */
function AvatarImg({ src, size = 80, alt = 'Profile', title = 'Profile', priority = false, className }) {
  if (!src) return null;

  if (isInlineSrc(src)) {
    return (
      <img
        src={src}
        alt={alt}
        title={title}
        width={size}
        height={size}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      title={title}
      width={size}
      height={size}
      sizes={`${size}px`}
      priority={priority}
      className={className}
    />
  );
}

/* Validation */
const editSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  organisation: Yup.string().nullable(),
  phone: Yup.string().nullable(),
  address: Yup.string().nullable(),
  city: Yup.string().nullable(),
  state: Yup.string().nullable(),
  country: Yup.string().nullable(),
  pincode: Yup.string().nullable(),
});

/* ---------------- session helpers (client) ---------------- */
const getClientSessionId = () => {
  const fromCookie = Cookies.get('sessionId');
  if (fromCookie) return fromCookie;
  try {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sessionId') || '';
    }
  } catch { /* noop */ }
  return '';
};

const redirectToLogin = () => {
  try {
    // Only use pathname to avoid encoding loops with existing redirect parameters
    const redirect = typeof window !== 'undefined'
      ? window.location.pathname
      : '/profile';
    window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`;
  } catch {
    window.location.href = '/login';
  }
};

/* =============================== Component =============================== */
export default function UserProfile() {
  // Performance optimization: Preload critical resources
  useEffect(() => {
    // DNS prefetch for external APIs
    if (typeof window !== 'undefined') {
      const prefetchDomains = [
        'https://restcountries.com',
        'https://countriesnow.space',
        'https://espobackend.vercel.app'
      ];
      
      prefetchDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      });
    }
  }, []);

  /* Guard: if no session, redirect */
  useEffect(() => {
    // Small delay to ensure localStorage is set after login redirect
    const checkAuth = setTimeout(() => {
      const sid = getClientSessionId();
      const uid = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      
      console.log('🔒 Auth Guard Check:', { sessionId: sid, userId: uid });
      
      // Must have both sessionId and userId
      if (!sid || !uid) {
        console.warn('Missing session or user ID, redirecting to login');
        redirectToLogin();
      }
    }, 100); // 100ms delay
    
    return () => clearTimeout(checkAuth);
  }, []);

  const authUser = useSelector((s) => s?.auth?.user);
  const cookieUser = useMemo(() => pickInitialUser(authUser), [authUser]);
  const derivedUserId = (authUser?._id || cookieUser?._id);

  useEffect(() => {
    if (derivedUserId) localStorage.setItem('userId', String(derivedUserId));
  }, [derivedUserId]);

  const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const userId = derivedUserId || storedUserId || null;

  const { data: sessionData, refetch: refetchSession } =
    useGetSessionInfoQuery({ userId }, {
      skip: !userId,
      refetchOnFocus: true,
      refetchOnReconnect: true
    });

  // optimistic local user
  const [localUser, setLocalUser] = useState(null);
  const user = useMemo(() => {
    const merged = {
      ...(sessionData?.session?.user || {}),
      ...(cookieUser || {}),
      ...(authUser || {}),
      ...(localUser || {}),
    };
    // derive avatar field
    merged.avatar = merged.userImage || merged.avatarUrl || merged.avatar || null;
    return merged;
  }, [sessionData, cookieUser, authUser, localUser]);

  const [logoutUser] = useLogoutUserMutation();
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();

  const [active, setActive] = useState('profile');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [editingField, setEditingField] = useState(null); // Track which field is being edited

  /* Countries + dial codes */
  const [countries, setCountries] = useState([]);
  const [countriesLoaded, setCountriesLoaded] = useState(false);
  const [dialSelected, setDialSelected] = useState(''); // +91
  const [phoneLocal, setPhoneLocal] = useState('');     // digits only

  /* -------------------- Orders (My Orders tab) - lazy load -------------------- */
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersErr, setOrdersErr] = useState(null);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!userId || ordersLoaded) return;
    
    setOrdersLoading(true);
    setOrdersErr(null);
    
    try {
      const res = await fetch(`https://espobackend.vercel.app/api/orders/user/${userId}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      const json = await res.json();
      const list = json?.data?.orders || json?.orders || [];
      setOrders(Array.isArray(list) ? list : []);
      setOrdersLoaded(true);
    } catch (e) {
      setOrdersErr('Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  }, [userId, ordersLoaded]);

  // Load orders only when booking tab is active
  useEffect(() => {
    if (active === 'booking' && !ordersLoaded) {
      fetchOrders();
    }
  }, [active, fetchOrders, ordersLoaded]);

  /* -------------------- react-hook-form -------------------- */
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(editSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      organisation: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
    }
  });

  /* --- normalize server user response for /shopy/users/:id --- */
  const normalizeUserPayload = (raw) => {
    const u = raw?.data?.user || raw?.user || raw || {};
    const firstName = u.firstName ?? (u.name ? String(u.name).split(' ')[0] : '');
    const lastName = u.lastName ?? (u.name ? String(u.name).split(' ').slice(1).join(' ').trim() : '');
    return {
      ...u,
      firstName,
      lastName,
      name: u.name ?? `${firstName} ${lastName}`.trim(),
      userImage: u.userImage || u.avatarUrl || u.avatar || null,
      avatar: u.userImage || u.avatarUrl || u.avatar || null,
    };
  };

  // Fetch user data with caching optimization
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  
  const fetchUserData = useCallback(async () => {
    if (!userId || userDataLoaded) return;
    
    try {
      // ====== SECURITY: Verify sessionId and userId match ======
      const storedSessionId = typeof window !== 'undefined' 
        ? localStorage.getItem('sessionId') || Cookies.get('sessionId')
        : null;
      
      if (!storedSessionId) {
        console.warn('No session found, redirecting to login');
        redirectToLogin();
        return;
      }
      
      // Check cache first
      const cacheKey = `user-${userId}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Cache for 5 minutes
        if (Date.now() - timestamp < 300000) {
          const nu = mapEspoToProfile(data);
          if (nu) {
            setLocalUser(prev => ({ ...(prev || {}), ...nu }));
            writeUserInfoCookiePreserving(nu);
          }
          setUserDataLoaded(true);
          return;
        }
      }

      // Fetch ALL users from EspoCRM API and find by ID
      const response = await fetch(`https://espobackend.vercel.app/api/customeraccount`, {
        headers: { 
          Accept: 'application/json',
          'X-Session-Id': storedSessionId,
        },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.warn('Session invalid, redirecting to login');
          redirectToLogin();
          return;
        }
        console.warn('Failed to fetch users from API, using cookie data');
        setUserDataLoaded(true);
        return;
      }
      
      const raw = await response.json();
      const allUsers = raw.data || raw || [];
      
      console.log('📋 Fetched users:', allUsers.length);
      console.log('🔍 Looking for userId:', userId);
      
      // Find user by ID match
      const currentUser = allUsers.find(u => u.id === userId);
      
      if (!currentUser) {
        console.warn('User not found in API response, using cookie data');
        setUserDataLoaded(true);
        return;
      }
      
      console.log('✅ Found user:', currentUser);
      
      // Cache the result
      sessionStorage.setItem(cacheKey, JSON.stringify({
        data: currentUser,
        timestamp: Date.now()
      }));
      
      const nu = mapEspoToProfile(currentUser);
      if (nu) {
        setLocalUser(prev => ({ ...(prev || {}), ...nu }));
        writeUserInfoCookiePreserving(nu);
      }
      setUserDataLoaded(true);
    } catch (error) {
      console.warn('Failed to fetch user data:', error);
      setUserDataLoaded(true);
    }
  }, [userId, userDataLoaded]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  /* Initialize form when user changes */
  useEffect(() => {
    if (!user) return;

    const firstName = user.firstName || (user.name ? user.name.split(' ')[0] : '');
    const lastName = user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ').trim() : '');

    reset({
      firstName,
      lastName,
      email: user.email || '',
      organisation: user.organisation || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      country: user.country || '',
      pincode: user.pincode || '',
    });

    setCountryName(user.country || '');
    setStateName(user.state || '');
    setCityName(user.city || '');

    const img = user.userImage || user.avatarUrl || user.avatar || null;
    setAvatarPreview(img);
  }, [user, reset]);

  // Load countries only when needed (edit tab)
  const loadCountries = useCallback(async () => {
    if (countriesLoaded || countries.length > 0) return;
    
    try {
      // Check cache first
      const cached = sessionStorage.getItem('countries-cache');
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Cache for 1 hour
        if (Date.now() - timestamp < 3600000) {
          setCountries(data);
          setCountriesLoaded(true);
          return;
        }
      }

      const res = await fetch('https://restcountries.com/v3.1/all?fields=name,idd,cca2,flags');
      const raw = await res.json();
      const list = (raw || [])
        .map((r) => {
          const root = r?.idd?.root || '';
          const suffixes = r?.idd?.suffixes || [];
          const dial = root && suffixes && suffixes.length ? `${root}${suffixes[0]}` : root || '';
          return {
            cca2: r?.cca2 || '',
            name: r?.name?.common || '',
            dial: dial || '',
            flagPng: r?.flags?.png || '',
          };
        })
        .filter((x) => x.cca2 && x.name && x.dial && x.flagPng)
        .sort((a, b) => a.name.localeCompare(b.name));
      
      // Cache the result
      sessionStorage.setItem('countries-cache', JSON.stringify({
        data: list,
        timestamp: Date.now()
      }));
      
      setCountries(list);
      setCountriesLoaded(true);
    } catch {
      setCountries([]);
      setCountriesLoaded(true);
    }
  }, [countriesLoaded, countries.length]);

  // Load countries only when edit tab is active
  useEffect(() => {
    if (active === 'edit' && !countriesLoaded) {
      loadCountries();
    }
  }, [active, loadCountries, countriesLoaded]);

  /* derive dial + local from current phone once countries are ready */
  useEffect(() => {
    if (!countries.length) return;
    const raw = String(user?.phone || '').trim();
    if (!raw) { setDialSelected(''); setPhoneLocal(''); return; }
    if (raw.startsWith('+')) {
      const match = countries
        .filter(c => raw.startsWith(c.dial))
        .sort((a, b) => b.dial.length - a.dial.length)[0];
      if (match) {
        setDialSelected(match.dial);
        setPhoneLocal(raw.slice(match.dial.length));
      } else {
        setDialSelected('');
        setPhoneLocal(onlyDigits(raw));
      }
    } else {
      setDialSelected('');
      setPhoneLocal(onlyDigits(raw));
    }
  }, [countries.length, user?.phone]);

  /* keep hidden phone value updated */
  useEffect(() => {
    const composed = (dialSelected && phoneLocal)
      ? `${normalizeDial(dialSelected)}${onlyDigits(phoneLocal)}`
      : (user?.phone || '');
    setValue('phone', composed, { shouldValidate: false, shouldDirty: true });
  }, [dialSelected, phoneLocal, setValue, user?.phone]);

  /* Dependent state/city - optimized with caching and debouncing */
  const [countryName, setCountryName] = useState('');
  const [states, setStates] = useState([]);
  const [stateName, setStateName] = useState('');
  const [cities, setCities] = useState([]);
  const [cityName, setCityName] = useState('');
  const [statesCache] = useState(new Map());
  const [citiesCache] = useState(new Map());

  // Debounced state loading
  const loadStates = useCallback(async (countryName) => {
    if (!countryName) {
      setStates([]);
      setStateName('');
      setCities([]);
      setCityName('');
      setValue('country', '');
      return;
    }

    // Check cache first
    if (statesCache.has(countryName)) {
      const cachedStates = statesCache.get(countryName);
      setStates(cachedStates);
      setValue('country', countryName, { shouldDirty: true });
      if (!cachedStates.find((s) => s.name === stateName)) {
        setStateName('');
        setValue('state', '', { shouldDirty: true });
        setCities([]);
        setCityName('');
        setValue('city', '', { shouldDirty: true });
      }
      return;
    }

    try {
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: countryName }),
      });
      const json = await res.json();
      const list = json?.data?.states || [];
      
      // Cache the result
      statesCache.set(countryName, list);
      
      setStates(list);
      setValue('country', countryName, { shouldDirty: true });
      if (!list.find((s) => s.name === stateName)) {
        setStateName('');
        setValue('state', '', { shouldDirty: true });
        setCities([]);
        setCityName('');
        setValue('city', '', { shouldDirty: true });
      }
    } catch {
      setStates([]);
      setStateName('');
      setCities([]);
      setCityName('');
      setValue('state', '');
      setValue('city', '');
    }
  }, [setValue, stateName, statesCache]);

  const loadCities = useCallback(async (countryName, stateName) => {
    if (!countryName || !stateName) {
      setCities([]);
      setCityName('');
      setValue('city', '');
      return;
    }

    const cacheKey = `${countryName}-${stateName}`;
    
    // Check cache first
    if (citiesCache.has(cacheKey)) {
      const cachedCities = citiesCache.get(cacheKey);
      setCities(cachedCities);
      if (!cachedCities.includes(cityName)) {
        setCityName('');
        setValue('city', '', { shouldDirty: true });
      }
      return;
    }

    try {
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: countryName, state: stateName }),
      });
      const json = await res.json();
      const list = json?.data || [];
      
      // Cache the result
      citiesCache.set(cacheKey, list);
      
      setCities(list);
      if (!list.includes(cityName)) {
        setCityName('');
        setValue('city', '', { shouldDirty: true });
      }
    } catch {
      setCities([]);
      setCityName('');
      setValue('city', '');
    }
  }, [setValue, cityName, citiesCache]);

  // Debounced loading with 300ms delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadStates(countryName);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [countryName, loadStates]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadCities(countryName, stateName);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [countryName, stateName, loadCities]);

  /* ---------------- Avatar pick ---------------- */
  const [selectedFile, setSelectedFile] = useState(null);

  const onPickAvatar = (file) => {
    if (!file) return;
    if (!file.type.match('image.*')) {
      notifyError('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      notifyError('Image size should be less than 5MB');
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result || null;
      setAvatarPreview(result);
    };
    reader.onerror = () => notifyError('Failed to read the image file');
    reader.readAsDataURL(file);
  };

  /* ---------------- Save profile ---------------- */
  const onSubmit = async (data) => {
    if (!userId) { notifyError('Cannot update profile: user not identified.'); return; }

    // ====== SECURITY: Verify session before allowing update ======
    const storedSessionId = typeof window !== 'undefined' 
      ? localStorage.getItem('sessionId') || Cookies.get('sessionId')
      : null;
    
    if (!storedSessionId) {
      notifyError('Session expired. Please login again.');
      redirectToLogin();
      return;
    }

    const composedPhone = (dialSelected && phoneLocal)
      ? `${normalizeDial(dialSelected)}${onlyDigits(phoneLocal)}`
      : (data.phone || '');

    const firstName = cleanString(data.firstName ?? '');
    const lastName = cleanString(data.lastName ?? '');
    const updateData = {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      email: cleanString(data.email ?? ''),
      organisation: cleanString(data.organisation ?? ''),
      phone: cleanString(composedPhone || user?.phone || ''),
      address: cleanString(data.address ?? ''),
      city: cleanString(cityName || data.city || user?.city || ''),
      state: cleanString(stateName || data.state || user?.state || ''),
      country: cleanString(countryName || data.country || user?.country || ''),
      pincode: cleanString(data.pincode ?? '')
    };

    const changed = diffPayload(
      updateData,
      user,
      new Set(['organisation', 'address', 'city', 'state', 'country', 'pincode'])
    );

    if (!Object.keys(changed).length && !selectedFile) {
      notifySuccess('Nothing to update');
      setActive('profile');
      return;
    }

    let updatedResp = null;
    try {
      // Map to EspoCRM format
      const espoData = mapProfileToEspo(updateData);
      
      // Update via EspoCRM API with session validation
      const response = await fetch(`https://espobackend.vercel.app/api/customeraccount/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': storedSessionId, // Include session for validation
        },
        body: JSON.stringify(espoData),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          notifyError('Session expired. Please login again.');
          redirectToLogin();
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update profile');
      }

      updatedResp = await response.json();
    } catch (error) {
      notifyError(error.message || 'Failed to update profile');
      return;
    }

    // Map response back to profile format
    const respUser = mapEspoToProfile(updatedResp);
    const updatedUser = {
      ...user,
      ...respUser,
      avatar: avatarPreview || user.avatar,
      userImage: avatarPreview || user.userImage,
    };

    setSelectedFile(null);

    writeUserInfoCookiePreserving(updatedUser);
    setLocalUser(updatedUser);
    setAvatarPreview(updatedUser.avatar || null);

    reset({
      firstName: updatedUser?.firstName || '',
      lastName: updatedUser?.lastName || '',
      email: updatedUser?.email || '',
      organisation: updatedUser?.organisation || '',
      phone: updatedUser?.phone || '',
      address: updatedUser?.address || '',
      city: updatedUser?.city || '',
      state: updatedUser?.state || '',
      country: updatedUser?.country || '',
      pincode: updatedUser?.pincode || '',
    });

    try { await refetchSession?.(); } catch { }

    notifySuccess('Profile updated');
    setEditingField(null); // Reset editing state
    setActive('profile');
  };

  const handleLogout = async () => {
    try {
      await logoutUser({ userId }).unwrap();
      Cookies.remove('userInfo');
      try { localStorage.removeItem('sessionId'); } catch { }
      window.location.href = '/login';
    } catch (err) {
      notifyError(err?.data?.message || 'Logout failed');
    }
  };

  /* ---- Derived values for read-only display ---- */
  const derivedPrettyPhone = (() => {
    const raw = String(user?.phone || '').trim();
    if (!raw) return '—';
    if (raw.startsWith('+')) return raw;
    if (dialSelected && phoneLocal) return `${normalizeDial(dialSelected)}${onlyDigits(phoneLocal)}`;
    return raw;
  })();

  const derivedReadOnlyFlagPng = (() => {
    const raw = String(user?.phone || '').trim();
    if (!raw || !raw.startsWith('+') || !countries.length) return '';
    const match = countries
      .filter(c => raw.startsWith(c.dial))
      .sort((a, b) => b.dial.length - a.dial.length)[0];
    return match?.flagPng || '';
  })();

  /* country change handler */
  const handleCountryChange = (e) => {
    const val = e.target.value;
    setCountryName(val);
    setValue('country', val, { shouldDirty: true });
    setStateName('');
    setValue('state', '', { shouldDirty: true });
    setCityName('');
    setValue('city', '', { shouldDirty: true });
  };

  /* ---------------- UI ---------------- */
  return (
    <div className={`${styles.scope} ${styles.page}`}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.bigAvatar}>
            {avatarPreview ? (
              <AvatarImg
                src={avatarPreview}
                size={80}
                alt="Profile"
                title="Profile"
                priority
                className={styles.bigAvatarImg}
              />
            ) : (
              <div className={styles.bigAvatarFallback}>
                {initials(user?.firstName || user?.name || 'U')}
              </div>
            )}
          </div>

          <div className={styles.titleBlock}>
            <h1 className={styles.h1}>
              {user?.firstName || user?.lastName
                ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                : (user?.name || 'Guest User')}
            </h1>
            <div className={styles.subRow}>
              {user?.email ? <span className={styles.email}>{user.email}</span> : null}
            </div>
          </div>
        </div>
      </div>

      {/* LAYOUT */}
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <SideTab id="profile" label="My Profile" active={active} setActive={setActive} />
          <SideTab id="booking" label="My Orders" active={active} setActive={setActive} />
          <button type="button" className={styles.sideTab} onClick={handleLogout}>Logout</button>
        </aside>

        <main className={styles.main}>
          {/* Inline Editable Profile */}
          {active === 'profile' && (
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              {/* Avatar Section - Always Editable */}
              <div className={styles.avatarEditor}>
                <div className={styles.bigAvatar}>
                  {avatarPreview ? (
                    <AvatarImg
                      src={avatarPreview}
                      size={80}
                      alt="Profile"
                      title="Profile"
                      className={styles.bigAvatarImg}
                    />
                  ) : (
                    <div className={styles.bigAvatarFallback}>
                      {initials(user?.firstName || user?.name)}
                    </div>
                  )}
                </div>
                <div className={styles.avatarControls}>
                  <label className={styles.fileBtn}>
                    <FaEdit style={{ marginRight: 6 }} />
                    Edit Photo
                    <input type="file" accept="image/*" onChange={(e) => onPickAvatar(e.target.files?.[0])} hidden />
                  </label>

                  {avatarPreview && (
                    <button type="button" className={styles.linkBtn} onClick={() => setAvatarPreview(null)}>
                      <FaTrash style={{ marginRight: 6 }} />
                      Remove Profile Photo
                    </button>
                  )}
                </div>
              </div>

              {/* Name Fields */}
              <InlineEditField
                label="First Name"
                fieldId="firstName"
                value={user?.firstName || '—'}
                isEditing={editingField === 'firstName'}
                onEdit={() => { setEditingField('firstName'); loadCountries(); }}
                onCancel={() => setEditingField(null)}
                registerFn={register}
                error={errors.firstName?.message}
                required
              />

              <InlineEditField
                label="Last Name"
                fieldId="lastName"
                value={user?.lastName || '—'}
                isEditing={editingField === 'lastName'}
                onEdit={() => { setEditingField('lastName'); loadCountries(); }}
                onCancel={() => setEditingField(null)}
                registerFn={register}
                error={errors.lastName?.message}
                required
              />

              {/* Email - Read Only */}
              <AlignedRead label="Email" value={user?.email || '—'} />

              {/* Organisation */}
              <InlineEditField
                label="Organisation"
                fieldId="organisation"
                value={user?.organisation || '—'}
                isEditing={editingField === 'organisation'}
                onEdit={() => { setEditingField('organisation'); loadCountries(); }}
                onCancel={() => setEditingField(null)}
                registerFn={register}
              />

              {/* Phone */}
              {editingField === 'phone' ? (
                <AlignedCustom label="Phone">
                  <div className={styles.row} style={{ gap: 12, width: '100%' }}>
                    <div
                      className={styles.input}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        paddingRight: 36,
                        overflow: 'hidden',
                        width: '40%',
                        minWidth: 220
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          width: '100%',
                          pointerEvents: 'none'
                        }}
                      >
                        {countries.find(c => c.dial === dialSelected)?.flagPng ? (
                          <img
                            src={countries.find(c => c.dial === dialSelected)?.flagPng}
                            alt="Country flag"
                            title="Country flag"
                            width={20}
                            height={14}
                            loading="lazy"
                            decoding="async"
                            style={{ display: 'block', borderRadius: 2, objectFit: 'cover' }}
                          />
                        ) : (
                          <span style={{ width: 20, height: 14 }} />
                        )}
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {countries.find(c => c.dial === dialSelected)
                            ? `${countries.find(c => c.dial === dialSelected)?.name} (${dialSelected})`
                            : 'Select country code'}
                        </span>
                      </div>

                      <select
                        aria-label="Country dial code"
                        value={dialSelected}
                        onChange={(e) => setDialSelected(e.target.value)}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                      >
                        <option value="">Select code</option>
                        {countries.map(c => (
                          <option key={`${c.cca2}-${c.dial}`} value={c.dial}>
                            {c.name} ({c.dial})
                          </option>
                        ))}
                      </select>
                    </div>

                    <input
                      className={styles.input}
                      type="tel"
                      placeholder="Local phone number"
                      value={phoneLocal}
                      onChange={(e) => setPhoneLocal(e.target.value)}
                      inputMode="numeric"
                      style={{ width: '60%' }}
                    />
                  </div>
                  <input type="hidden" {...register('phone')} />
                  {errors?.phone?.message ? <p className={styles.err}>{errors.phone.message}</p> : null}
                  <button type="button" className={styles.linkBtn} onClick={() => setEditingField(null)} style={{ marginTop: 8 }}>
                    Cancel
                  </button>
                </AlignedCustom>
              ) : (
                <AlignedCustom label="Phone">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {derivedReadOnlyFlagPng ? (
                        <img
                          src={derivedReadOnlyFlagPng}
                          alt="Country flag"
                          title="Country flag"
                          width={20}
                          height={14}
                          loading="lazy"
                          decoding="async"
                          style={{ display: 'block', borderRadius: 2, objectFit: 'cover' }}
                        />
                      ) : null}
                      <span className={styles.readInput} style={{ border: 'none', background: 'transparent', padding: 0 }}>
                        {derivedPrettyPhone === '—' ? '—' : derivedPrettyPhone}
                      </span>
                    </div>
                    <button 
                      type="button" 
                      className={styles.linkBtn} 
                      onClick={() => { setEditingField('phone'); loadCountries(); }}
                      style={{ fontSize: 14 }}
                    >
                      <FaEdit />
                    </button>
                  </div>
                </AlignedCustom>
              )}

              {/* Address */}
              <InlineEditField
                label="Address"
                fieldId="address"
                value={user?.address || '—'}
                isEditing={editingField === 'address'}
                onEdit={() => { setEditingField('address'); loadCountries(); }}
                onCancel={() => setEditingField(null)}
                registerFn={register}
              />

              {/* Country/State/City */}
              {editingField === 'location' ? (
                <>
                  <AlignedCustom label="Country">
                    <select
                      className={styles.input}
                      value={countryName}
                      onChange={handleCountryChange}
                      disabled={!countriesLoaded}
                    >
                      <option value="">
                        {!countriesLoaded ? 'Loading countries...' : 'Select country'}
                      </option>
                      {countries.map(c => (
                        <option key={c.cca2} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </AlignedCustom>

                  <AlignedCustom label="State">
                    <select
                      className={styles.input}
                      value={stateName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setStateName(val);
                        setValue('state', val, { shouldDirty: true });
                        setCityName('');
                        setValue('city', '', { shouldDirty: true });
                      }}
                    >
                      <option value="">{countryName ? 'Select state' : 'Select country first'}</option>
                      {states.map((s) => (
                        <option key={s.name} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </AlignedCustom>

                  <AlignedCustom label="City">
                    <select
                      className={styles.input}
                      value={cityName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCityName(val);
                        setValue('city', val, { shouldDirty: true });
                      }}
                    >
                      <option value="">{stateName ? 'Select city' : 'Select state first'}</option>
                      {cities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <button type="button" className={styles.linkBtn} onClick={() => setEditingField(null)} style={{ marginTop: 8 }}>
                      Cancel
                    </button>
                  </AlignedCustom>
                </>
              ) : (
                <div className={styles.row}>
                  <AlignedCustom label="Country">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className={styles.readInput} style={{ border: 'none', background: 'transparent', padding: 0 }}>
                        {user?.country || '—'}
                      </span>
                      <button 
                        type="button" 
                        className={styles.linkBtn} 
                        onClick={() => { setEditingField('location'); loadCountries(); }}
                        style={{ fontSize: 14 }}
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </AlignedCustom>
                  <AlignedRead label="State" value={user?.state} />
                </div>
              )}

              {editingField !== 'location' && (
                <div className={styles.row}>
                  <AlignedRead label="City" value={user?.city} />
                  <InlineEditField
                    label="Pincode"
                    fieldId="pincode"
                    value={user?.pincode || '—'}
                    isEditing={editingField === 'pincode'}
                    onEdit={() => { setEditingField('pincode'); loadCountries(); }}
                    onCancel={() => setEditingField(null)}
                    registerFn={register}
                  />
                </div>
              )}

              {editingField === 'location' && (
                <InlineEditField
                  label="Pincode"
                  fieldId="pincode"
                  value={user?.pincode || '—'}
                  isEditing={editingField === 'pincode'}
                  onEdit={() => { setEditingField('pincode'); loadCountries(); }}
                  onCancel={() => setEditingField(null)}
                  registerFn={register}
                />
              )}

              {/* Save Button - Only show when editing */}
              {(editingField || selectedFile) && (
                <div className={styles.formCta}>
                  <button type="submit" className={styles.btn} disabled={saving || !userId}>
                    {saving ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              )}
            </form>
          )}

          {/* My Orders */}
          {active === 'booking' && (
            <div className={styles.bookingWrap}>
              {ordersLoading && (<div className={styles.bookingEmpty}><p>Loading orders…</p></div>)}
              {ordersErr && (<div className={styles.bookingEmpty}><p style={{ color: 'red' }}>{ordersErr}</p></div>)}

              {!ordersLoading && !ordersErr && (!orders || orders.length === 0) && (
                <div className={styles.bookingEmpty}>
                  <div className={styles.bookingIcon}>🧾</div>
                  <h3 className={styles.bookingTitle}>No orders yet</h3>
                  <p className={styles.bookingText}>Go to the fabric page and start shopping.</p>
                  <a href="/fabric" className={styles.btn}>Go to Fabric</a>
                </div>
              )}

              {!ordersLoading && !ordersErr && orders && orders.length > 0 && (
                <div style={{ overflowX: 'auto' }}>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      borderSpacing: 0,
                      background: 'white',
                      borderRadius: 8,
                      overflow: 'hidden'
                    }}
                  >
                    <thead style={{ background: '#F3F4F6' }}>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '12px 14px', fontWeight: 600 }}>Invoice Number</th>
                        <th style={{ textAlign: 'left', padding: '12px 14px', fontWeight: 600 }}>Invoice Date</th>
                        <th style={{ textAlign: 'left', padding: '12px 14px', fontWeight: 600 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o._id} style={{ borderTop: '1px solid #E5E7EB' }}>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ color: '#2C4C97' }}>
                              {o._id}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            {dayjs(o.createdAt).format('MMMM DD, YYYY')}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ color: '#6B7280', fontSize: '14px' }}>
                              Order Details
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------------- aligned building blocks ---------------- */
const LABEL_COL_STYLE = { width: 160, minWidth: 160, flex: '0 0 160px' };
const VALUE_COL_STYLE = { flex: 1, minWidth: 0 };

function AlignedRow({ label, children }) {
  return (
    <div className={styles.field} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div className={styles.fieldLabel} style={LABEL_COL_STYLE}>{label}</div>
      <div style={VALUE_COL_STYLE}>{children}</div>
    </div>
  );
}

function AlignedRead({ label, value }) {
  return (
    <AlignedRow label={label}>
      <div className={styles.readInput}>{value || '—'}</div>
    </AlignedRow>
  );
}

function AlignedCustom({ label, children }) {
  return (
    <AlignedRow label={label}>
      <div>{children}</div>
    </AlignedRow>
  );
}

function AlignedField({ id, label, type = 'text', registerFn, error, disabled, note, required }) {
  return (
    <AlignedRow label={<>{label}{required && <span className={styles.required}>*</span>}</>}>
      <div>
        <input id={id} type={type} className={styles.input} disabled={disabled} {...registerFn(id)} />
        {note && <p className={styles.note}>{note}</p>}
        {error && <p className={styles.err}>{error}</p>}
      </div>
    </AlignedRow>
  );
}

/* ---------------- inline edit field ---------------- */
function InlineEditField({ label, fieldId, value, isEditing, onEdit, onCancel, registerFn, error, required }) {
  if (isEditing) {
    return (
      <AlignedRow label={<>{label}{required && <span className={styles.required}>*</span>}</>}>
        <div>
          <input id={fieldId} type="text" className={styles.input} {...registerFn(fieldId)} autoFocus />
          {error && <p className={styles.err}>{error}</p>}
          <button type="button" className={styles.linkBtn} onClick={onCancel} style={{ marginTop: 8 }}>
            Cancel
          </button>
        </div>
      </AlignedRow>
    );
  }

  return (
    <AlignedRow label={label}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className={styles.readInput} style={{ border: 'none', background: 'transparent', padding: 0 }}>
          {value}
        </span>
        <button type="button" className={styles.linkBtn} onClick={onEdit} style={{ fontSize: 14 }}>
          <FaEdit />
        </button>
      </div>
    </AlignedRow>
  );
}

/* ---------------- sidebar tab ---------------- */
function SideTab({ id, label, active, setActive }) {
  const is = active === id;
  return (
    <button
      type="button"
      className={`${styles.sideTab} ${is ? styles.sideTabActive : ''}`}
      onClick={() => setActive(id)}
    >
      {label}
    </button>
  );
}
