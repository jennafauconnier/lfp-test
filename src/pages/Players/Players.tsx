import React, {useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import axios from 'axios';
import styled from 'styled-components/native';
import {ScrollView, Image} from 'react-native';
import Player from '../Player/Player';

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  position: number;
  ultraPosition: number;
  quotation: number;
  clubId: string;
  stats: {
    averageRating: number;
    totalGoals: number;
    totalMatches: number;
    totalStartedMatches: number;
    totalPlayedMatches: number;
  };
}

interface ClubPlayersMap {
  [key: string]: Player[];
}

interface Club {
  id: string;
  name: {
    [key: string]: string;
  };
  shortName: string;
  defaultJerseyUrl: string;
  defaultAssets: {
    logo: {
      small: string;
      medium: string;
    };
  };
}

interface ChampionshipClubs {
  [key: string]: Club;
}

export default function Players() {
  const [clubs, setClubs] = useState<ChampionshipClubs>({});
  const [players, setPlayers] = useState([]);
  const [clubPlayers, setClubPlayers] = useState<ClubPlayersMap>({});
  const [selectedPlayerId, setSelectedPlayerId] = useState<Player | null>(null);

  useEffect(() => {
    getAllPlayers();
    getAllClubs();
  }, []);

  const getAllClubs = async () => {
    try {
      const res = await axios.get(
        'https://api.mpg.football/api/data/championship-clubs',
      );
      const championshipClubs: ChampionshipClubs = res.data?.championshipClubs;

      setClubs(championshipClubs);
    } catch (err) {
      console.log('Error fetching data:', err);
    }
  };

  const getAllPlayers = async () => {
    try {
      const res = await axios.get(
        'https://api.mpg.football/api/data/championship-players-pool/1',
      );
      const poolPlayers = res.data.poolPlayers;
      setPlayers(poolPlayers);

      // Regrouper les joueurs par club
      const clubPlayersMap: ClubPlayersMap = poolPlayers.reduce(
        (acc: ClubPlayersMap, player: Player) => {
          const {clubId} = player;
          if (acc[clubId]) {
            acc[clubId].push(player);
          } else {
            acc[clubId] = [player];
          }
          return acc;
        },
        {},
      );

      setClubPlayers(clubPlayersMap);
    } catch (err) {
      console.log('Error fetching data:', err);
    }
  };

  const getPlayerPosition = (ultraPosition: number) => {
    switch (ultraPosition) {
      case 10:
        return 'Gardien - G';
      case 20:
        return 'Defenseur - D';
      case 21:
        return 'Lateral - L';
      case 30:
        return 'Milieu défensif - MD';
      case 31:
        return 'Milieu offensif - MO';
      case 40:
        return 'Attaquant - A';
      default:
        return '';
    }
  };

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayerId(player);
  };

  const handleGoBack = () => {
    setSelectedPlayerId(null);
  };

  const renderClubItem = ({item}: {item: Player}) => {
    const clubId = item?.clubId;
    const clubPlayersList = clubPlayers[clubId] || [];
    const club = clubs[clubId];

    clubPlayersList.sort((a: Player, b: Player) => {
      return a.ultraPosition - b.ultraPosition;
    });

    return (
      <ContainerClub>
        <Header>
          <Image
            source={{uri: club?.defaultAssets?.logo?.small}}
            style={{width: 50, height: 50}}
          />
          <ClubTitle>Club: {club?.name?.['fr-FR']}</ClubTitle>
          <Text />
        </Header>

        {clubPlayersList.map((player: Player) => (
          <Section key={player.id} onPress={() => handlePlayerClick(player)}>
            <Firstname>{player.firstName}</Firstname>
            <Lastname>{player.lastName}</Lastname>
            <Placement>{getPlayerPosition(player.ultraPosition)}</Placement>
          </Section>
        ))}
      </ContainerClub>
    );
  };

  return (
    <View>
      {selectedPlayerId ? (
        <Player player={selectedPlayerId} onGoBack={handleGoBack} />
      ) : (
        <FlatList
          data={players}
          keyExtractor={item => item.id}
          renderItem={renderClubItem}
        />
      )}
    </View>
  );
}

const ContainerClub = styled(ScrollView)`
  border-color: #4255ce;
  border-width: 1px;
  border-radius: 24px;
  padding: 14px 12px;
  width: 300px;
  height: 400px;
  margin-bottom: 30px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Section = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  border: 1px solid #4255ce;
  background: rgba(171, 175, 171, 0.239);
  border-radius: 5px;
  padding: 10px 5px;
  margin-bottom: 5px;
`;

const ClubTitle = styled(Text)`
  font-size: 16px;
`;

const Firstname = styled(Text)`
  font-size: 13px;
  margin-right: 6px;
`;

const Lastname = styled(Text)`
  font-size: 14px;
  font-weight: 500;
`;
const Placement = styled(Text)`
  margin-left: 6px;
  color: #5fd75f;
`;
