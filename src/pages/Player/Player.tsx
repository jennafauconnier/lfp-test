import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import axios from 'axios';
import styled from 'styled-components/native';

interface Props {
  player: any;
  onGoBack: () => void;
}

interface PlayerStats {
  championships: {
    [championshipId: string]: {
      averagePercentRanks: any;
      clubs: {
        [clubId: string]: {
          stats: {
            totalPlayedMatches: number;
            averageRating: number;
            totalMinutesPlayed: number;
          };
        };
      };
      keySeasonStats: any;
      mpg_championship_club_694: any;
      percentRanks: any;
      total: any;
    };
  };
  id: string;
  position: number;
  type: string;
  ultraPosition: number;
}

function formatterMinutes(m) {
  const hours = Math.floor(m / 60);
  const minutes = m % 60;

  return `${hours}h ${minutes}m`;
}

export default function Player({player, onGoBack}: Props) {
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);

  const getPlayerStats = async () => {
    try {
      const res = await axios.get(
        `https://api.mpg.football/api/data/championship-player-stats/${player.id}/2022`,
      );
      setPlayerStats(res.data);
    } catch (err) {
      console.log('Error fetching data:', err);
    }
  };

  useEffect(() => {
    getPlayerStats();
  }, []);

  return (
    <Container>
      <BackButton onPress={onGoBack}>
        <Text>🔙</Text>
      </BackButton>
      <TitleName>
        {player.firstName} {player.lastName}
      </TitleName>

      {playerStats && (
        <View>
          {Object.keys(playerStats.championships).map(championshipKey => {
            const championshipStats =
              playerStats.championships[championshipKey];
            return (
              <View key={championshipKey}>
                {Object.keys(championshipStats.clubs).map(clubKey => {
                  const playerStats = championshipStats.clubs[clubKey];
                  return (
                    <ChampionshipContainer key={clubKey}>
                      <Title>Championship : {championshipKey}</Title>
                      <Text>
                        Match joués : {playerStats.stats?.totalPlayedMatches}
                      </Text>
                      <Text>
                        Moyenne : {playerStats.stats?.averageRating.toFixed()}
                      </Text>
                      <Text>
                        Temps passé sur le terrain :{' '}
                        {formatterMinutes(
                          playerStats.stats?.totalMinutesPlayed,
                        )}
                      </Text>
                    </ChampionshipContainer>
                  );
                })}
              </View>
            );
          })}
        </View>
      )}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`;

const BackButton = styled.TouchableOpacity`
  border: 1px solid #5fd75f;
  border-radius: 10px;
  width: 60px;
  height: 30px;
  align-items: center;
  justify-content: center;
`;

const TitleName = styled(Text)`
  margin-top: 20px;
  font-size: 26px;
  color: #4255ce;
  align-self: center;
`;

const ChampionshipContainer = styled.View`
  margin: 10px 0px;
`;

const Title = styled(Text)`
  font-size: 18px;
  color: #5fd75f;
`;
