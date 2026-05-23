import { api } from './api';

export const roomService = {
  getRoomTypes: () => api.get('/room-types'),
  getRoomType: (id) => api.get(`/room-types/${id}`),
  createRoomType: (data) => api.post('/room-types', data),
  updateRoomType: (id, data) => api.put(`/room-types/${id}`, data),
  deleteRoomType: (id) => api.delete(`/room-types/${id}`),
  
  getRooms: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/rooms${params ? `?${params}` : ''}`);
  },
  getRoom: (id) => api.get(`/rooms/${id}`),
  createRoom: (data) => api.post('/rooms', data),
  updateRoom: (id, data) => api.put(`/rooms/${id}`, data),
  deleteRoom: (id) => api.delete(`/rooms/${id}`),
  
  checkAvailability: (checkIn, checkOut, roomTypeId) => {
    const params = new URLSearchParams({ check_in: checkIn, check_out: checkOut });
    if (roomTypeId) params.append('room_type_id', roomTypeId);
    return api.get(`/rooms/availability?${params}`);
  },
  
  getAvailable: (searchData) => {
    const params = new URLSearchParams({
      check_in: searchData.checkIn,
      check_out: searchData.checkOut
    });
    if (searchData.roomType) params.append('room_type', searchData.roomType);
    return api.get(`/rooms/available?${params}`);
  }
};

export default roomService;
