import { Box, Flex, Icon, Skeleton, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsFillStarFill } from "react-icons/bs";
import { connect } from "react-redux";
import { avaliacoesActions } from "../../store/actions";
import { isEmpty } from "lodash";
import { handleTotalStar } from "../AvaliacoesContainer/AvaliacoesContainer";

function Stars({ avaliacoes, getAll, data, subdomain }) {
  const [avaliacoesData, setAvaliacoesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setAvaliacoesData([]);
    setIsLoading(false);

    if (isEmpty(avaliacoes)) {
      getAll(subdomain);
    }
  }, [subdomain]);

  useEffect(() => {
    if (avaliacoes.items) {
      setAvaliacoesData(
        avaliacoes.items.filter((entry) => entry.empresa == subdomain)
      );
      setIsLoading(false);
    } else {
      setAvaliacoesData([]);
    }

    if (avaliacoes.error == "OK" || avaliacoes.error) {
      setAvaliacoesData([]);
      setIsLoading(false);
    }

    if (avaliacoes.loading) {
      setIsLoading(avaliacoes.loading);
      setAvaliacoesData([]);
    }
  }, [avaliacoes]);

  if (isLoading) {
    return <Skeleton w="30px" h="20px" />;
  }

  return (
    <Flex alignItems="center" gap="4px">
      <Icon as={BsFillStarFill} fontSize="xs" fill="#FEAD1D" />
      <Text fontSize="xs" color="#FEAD1D" fontWeight={600}>
        {handleTotalStar(avaliacoesData)}
      </Text>
    </Flex>
  );
}

function mapState(state) {
  const { avaliacoes } = state;
  return { avaliacoes };
}

const actionCreators = {
  getAll: avaliacoesActions.getAll,
};

export default connect(mapState, actionCreators)(Stars);
