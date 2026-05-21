import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "./store/cartActions";

const CartSync = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(mergeCart());
    }
  }, [dispatch, user]);

  return null;
};

export default CartSync;
