import React, { useState, useEffect, useCallback } from 'react'
import { HighlightCard } from '../../components/HighlightCard'
import {
  TransactionCard,
  TransactionCardProps
} from '../../components/TransactionCard'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { ActivityIndicator } from 'react-native'

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  LogoutButton,
  Icon,
  HighlightCardsContainer,
  Transactions,
  Title,
  TransactionsList,
  LoadContainer
} from './styles'
import { useAuth } from '../../hooks/auth'

export interface DataTransactionListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<DataTransactionListProps[]>(
    []
  )
  const {signOut, user} = useAuth()

  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData
  )

  function getLastTransactionsDate(
    collection: DataTransactionListProps[],
    type: 'income' | 'outcome'
  ) {

    const collectionFilttered = collection.filter(transaction => transaction.type === type);

    if(collectionFilttered.length === 0) {
      return 0;
    }


    const lastTransaction = new Date(
      Math.max.apply(
      Math,
      collectionFilttered
        .map(transaction => new Date().getTime()))
    )

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString("pt-BR", { month: "long"})}`;
  }

  async function loadTransactions() {
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey)
    const transactions = response ? JSON.parse(response) : []

    let entriesTotal = 0
    let expensiveTotal = 0

    const transactionsFormatted: DataTransactionListProps[] = transactions.map(
      (item: DataTransactionListProps) => {
        if (item.type === 'income') {
          entriesTotal += Number(item.amount)
        } else {
          expensiveTotal += Number(item.amount)
        }

        const amount = Number(item.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }).format(new Date())

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date
        }
      }
    )

    setTransactions(transactionsFormatted);

    const lastTransactionEntries = getLastTransactionsDate(transactions, "income");
    const lastTransactionExpensives = getLastTransactionsDate(transactions, "outcome");

    const totalInterval = lastTransactionEntries === 0 ? "Não há transações" : `01 a ${lastTransactionEntries}`;

    const total = entriesTotal - expensiveTotal

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionEntries === 0 ? "Não há transações" : `Última entrada dia ${lastTransactionEntries}`,
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionExpensives === 0 ? "Não há transações" : `Última Saída dia ${lastTransactionExpensives}`,
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: totalInterval,
      }
    })

    setIsLoading(false)
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadTransactions()
    }, [])
  )

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color="orange" size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{
                    uri: user.photo
                  }}
                />
                <User>
                  <UserGreeting>Olá, </UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCardsContainer>
            <HighlightCard
              type="income"
              title="Entradas"
              amount={highlightData?.entries?.amount}
              lastTransition={highlightData.entries.lastTransaction}
            />
            <HighlightCard
              type="outcome"
              title="Saídas"
              amount={highlightData?.expensives?.amount}
              lastTransition={highlightData.expensives.lastTransaction}
            />
            <HighlightCard
              type="total"
              title="Total"
              amount={highlightData?.total?.amount}
              lastTransition={highlightData.total.lastTransaction}
            />
          </HighlightCardsContainer>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionsList
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  )
}
