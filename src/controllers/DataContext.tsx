// Controller - Data Management Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Facility, Reservation, ReservationStatus, FacilityStatus } from '../models/types';

interface DataContextType {
  facilities: Facility[];
  reservations: Reservation[];
  addFacility: (facility: Omit<Facility, 'id' | 'createdAt'>) => void;
  updateFacility: (id: string, facility: Partial<Facility>) => void;
  deleteFacility: (id: string) => void;
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>, onSuccess?: () => void) => void;
  updateReservationStatus: (id: string, status: ReservationStatus, adminNote?: string, onSuccess?: () => void) => void;
  getUserReservations: (userId: string) => Reservation[];
  getFacilityReservations: (facilityId: string) => Reservation[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock initial data
const INITIAL_FACILITIES: Facility[] = [
  {
    id: '1',
    name: 'Auditorium Utama',
    capacity: 500,
    location: 'Gedung A Lantai 1',
    status: 'available',
    description: 'Auditorium modern dengan fasilitas multimedia lengkap untuk acara besar kampus',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    features: ['AC', 'Proyektor 4K', 'Sound System', 'Lighting Stage', 'WiFi'],
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Ruang Seminar 1',
    capacity: 100,
    location: 'Gedung B Lantai 3',
    status: 'available',
    description: 'Ruang seminar dengan layout fleksibel untuk diskusi dan presentasi',
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&q=80',
    features: ['AC', 'Proyektor', 'Whiteboard', 'WiFi', 'Meja Lipat'],
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Lab Komputer',
    capacity: 50,
    location: 'Gedung C Lantai 2',
    status: 'available',
    description: 'Laboratorium komputer dengan spesifikasi tinggi untuk pembelajaran dan riset',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    features: ['50 PC High-End', 'AC', 'Proyektor', 'WiFi Gigabit', 'Software Development'],
    createdAt: new Date()
  },
  {
    id: '4',
    name: 'Meeting Room Executive',
    capacity: 20,
    location: 'Gedung D Lantai 5',
    status: 'available',
    description: 'Ruang meeting eksklusif dengan pemandangan kota untuk pertemuan penting',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    features: ['AC', 'Smart TV', 'Video Conference', 'Pantry', 'WiFi Premium'],
    createdAt: new Date()
  },
  {
    id: '5',
    name: 'Lapangan Olahraga Indoor',
    capacity: 200,
    location: 'Gedung Sport Center',
    status: 'available',
    description: 'Fasilitas olahraga indoor multifungsi untuk berbagai jenis aktivitas',
    image: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=800&q=80',
    features: ['Basket Court', 'Futsal Court', 'AC', 'Tribun', 'Locker Room'],
    createdAt: new Date()
  },
  {
    id: '6',
    name: 'Ruang Kelas Multimedia',
    capacity: 40,
    location: 'Gedung E Lantai 2',
    status: 'available',
    description: 'Kelas modern dengan teknologi pembelajaran interaktif',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
    features: ['AC', 'Interactive Board', 'Tablet PC', 'WiFi', 'Comfortable Seating'],
    createdAt: new Date()
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    // Load from localStorage or use initial data
    const savedFacilities = localStorage.getItem('facilities');
    const savedReservations = localStorage.getItem('reservations');
    
    if (savedFacilities) {
      setFacilities(JSON.parse(savedFacilities, (key, value) => {
        if (key === 'createdAt') return new Date(value);
        return value;
      }));
    } else {
      setFacilities(INITIAL_FACILITIES);
    }

    if (savedReservations) {
      setReservations(JSON.parse(savedReservations, (key, value) => {
        if (key === 'createdAt' || key === 'date') return new Date(value);
        return value;
      }));
    }
  }, []);

  useEffect(() => {
    // Save to localStorage
    if (facilities.length > 0) {
      localStorage.setItem('facilities', JSON.stringify(facilities));
    }
  }, [facilities]);

  useEffect(() => {
    if (reservations.length > 0) {
      localStorage.setItem('reservations', JSON.stringify(reservations));
    }
  }, [reservations]);

  const addFacility = (facility: Omit<Facility, 'id' | 'createdAt'>) => {
    const newFacility: Facility = {
      ...facility,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setFacilities(prev => [...prev, newFacility]);
  };

  const updateFacility = (id: string, updates: Partial<Facility>) => {
    setFacilities(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const deleteFacility = (id: string) => {
    setFacilities(prev => prev.filter(f => f.id !== id));
  };

  const addReservation = (reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>, onSuccess?: () => void) => {
    const newReservation: Reservation = {
      ...reservation,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date()
    };
    setReservations(prev => [...prev, newReservation]);
    if (onSuccess) onSuccess();
  };

  const updateReservationStatus = (id: string, status: ReservationStatus, adminNote?: string, onSuccess?: () => void) => {
    setReservations(prev =>
      prev.map(r => (r.id === id ? { ...r, status, adminNote } : r))
    );
    if (onSuccess) onSuccess();
  };

  const getUserReservations = (userId: string) => {
    return reservations.filter(r => r.userId === userId);
  };

  const getFacilityReservations = (facilityId: string) => {
    return reservations.filter(r => r.facilityId === facilityId);
  };

  return (
    <DataContext.Provider
      value={{
        facilities,
        reservations,
        addFacility,
        updateFacility,
        deleteFacility,
        addReservation,
        updateReservationStatus,
        getUserReservations,
        getFacilityReservations
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}