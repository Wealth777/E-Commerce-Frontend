import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addOrder, updateOrder } from "../store/orderSlice";
import { getNotificationSocket } from "../services/socketService";

const useOrderSocket = () => {
    const dispatch = useDispatch();

    const { isAuthenticated, role } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (!isAuthenticated) return;

        if (role !== "buyer" && role !== "vendor") return;

        const socket = getNotificationSocket();

        if (!socket) {
            console.warn(
                "Order socket: shared notification socket is not available yet."
            );
            return;
        }

        const handleNewOrder = (payload) => {
            if (!payload?.order) return;

            dispatch(addOrder(payload.order));
        };

        const handleOrderUpdated = (payload) => {
            if (!payload?.order) return;

            dispatch(updateOrder(payload.order));
        };

        const attachOrderListeners = () => {
            socket.off("order:new", handleNewOrder);
            socket.off("order:updated", handleOrderUpdated);

            socket.on("order:new", handleNewOrder);
            socket.on("order:updated", handleOrderUpdated);
        };

        const handleConnect = () => {
            console.log("Order socket connected:", socket.id);
            attachOrderListeners();
        };

        socket.on("connect", handleConnect);

        if (socket.connected) {
            attachOrderListeners();
        }

        return () => {
            socket.off("connect", handleConnect);
            socket.off("order:new", handleNewOrder);
            socket.off("order:updated", handleOrderUpdated);
        };
    }, [dispatch, isAuthenticated, role]);
};

export default useOrderSocket;