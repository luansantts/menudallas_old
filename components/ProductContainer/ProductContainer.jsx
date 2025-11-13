import React, { useEffect, useState } from "react";
import { NavbarProduct } from "../NavbarProduct";
import { InfoProduct } from "../InfoProduct";
import { FooterProduct } from "../FooterProduct";
import Head from "next/head";
import { connect } from "react-redux";
import { productDetailActions } from "../../store/actions";
import { useRouter } from "next/router";
import { isEmpty } from "lodash";

function ProductContainer({ data, productDetail, subdomain, getAll }) {
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { g, p } = router.query;

  useEffect(() => {
    if (g && p) {
      setProductData([]);
      setIsLoading(false);
      getAll(data.user_id, g, p);
    }
  }, [g, p]);

  useEffect(() => {
    if (productDetail.items) {
      setProductData(productDetail.items);

      // if(productDetail.items[0].id_produto == 0){
      //     router.push('/lista');
      // }

      setIsLoading(false);
    } else {
      setProductData([]);
    }

    if (productDetail.loading) {
      setIsLoading(productDetail.loading);
    }
  }, [productDetail]);

  if (isLoading) {
    return null;
  }

  if (
    productDetail.items == undefined ||
    productDetail.loading ||
    isEmpty(productData)
  ) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{productData[0]?.descricao}</title>
      </Head>
      <NavbarProduct
        productData={productData}
        subdomain={subdomain}
        onOpenCart={() => {
          // Função para abrir a sacola - será implementada no InfoProduct
          const event = new CustomEvent("openCart");
          window.dispatchEvent(event);
        }}
      />
      <InfoProduct
        subdomain={subdomain}
        productData={productData}
        data={data}
      />
    </>
  );
}

function mapState(state) {
  const { productDetail } = state;
  return { productDetail };
}

const actionCreators = {
  getAll: productDetailActions.getAll,
};

export default connect(mapState, actionCreators)(ProductContainer);
