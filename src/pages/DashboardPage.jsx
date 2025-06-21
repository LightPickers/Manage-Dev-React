import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useGetUsersQuery } from "@/features/users/userApi";
import { useGetProductsQuery } from "@/features/products/productApi";
import { useGetCouponsQuery } from "@/features/coupons/couponApi";
import { useGetOrdersQuery } from "@/features/orders/orderApi";

function DashboardPage() {
  const { data: usersData, isLoading: isGetUsersLoading } = useGetUsersQuery();
  const { data: productsData, isLoading: isGetProductsLoading } = useGetProductsQuery();
  const { data: ordersData, isLoading: isGetOrdersLoading } = useGetOrdersQuery({
    page: 1,
    per: 9999,
  });
  const { data: couponsData, isLoading: isGetCouponsLoading } = useGetCouponsQuery({
    page: 1,
    per: 9999,
  });

  const usersNumber = usersData?.data?.totalUsers;
  const productsNumber = productsData?.total_product;
  const ordersNumber = ordersData?.data?.totalOrders;
  const couponsNumber = couponsData?.data?.length;

  if (isGetUsersLoading || isGetProductsLoading || isGetOrdersLoading || isGetCouponsLoading) {
    return <div className="container text-center py-20">載入中...</div>;
  }

  return (
    <div className="container py-20">
      <div className="d-flex flex-column gap-10">
        <h3>後台總覽</h3>

        <div className="row row-gap-6">
          <div className="col-lg-6">
            <Link to="/users" className="text-decoration-none text-dark">
              <div className="card card-hover border-0 text-center shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">會員數量</h5>
                  <p className="card-text display-6">{usersNumber}</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-lg-6">
            <Link to="/orders" className="text-decoration-none text-dark">
              <div className="card card-hover border-0 text-center shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">訂單數量</h5>
                  <p className="card-text display-6">{ordersNumber}</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-lg-6">
            <Link to="/products" className="text-decoration-none text-dark">
              <div className="card card-hover border-0 text-center shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">商品數量</h5>
                  <p className="card-text display-6">{productsNumber}</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-lg-6">
            <Link to="/coupons" className="text-decoration-none text-dark">
              <div className="card card-hover border-0 text-center shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">優惠券數量</h5>
                  <p className="card-text display-6">{couponsNumber}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
