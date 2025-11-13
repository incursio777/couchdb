export const base44 = {
  entities: {
    GameScore: {
      create: async (data) => {
        console.log('Mock save score', data)
        return { id: Date.now(), ...data }
      }
      ,
      list: async (sort, limit = 100) => {
        // Return some mocked scores for the leaderboard demo
        const sample = [
          { id: 1, player_name: 'Ana', score: 3200, map: 'easy', rounds_completed: 21, enemies_destroyed: 120, boss_defeated: true },
          { id: 2, player_name: 'Luis', score: 2800, map: 'medium', rounds_completed: 19, enemies_destroyed: 110, boss_defeated: false },
          { id: 3, player_name: 'Marta', score: 2500, map: 'hard', rounds_completed: 18, enemies_destroyed: 100, boss_defeated: false }
        ];

        // Simulate network delay
        await new Promise(r => setTimeout(r, 200));
        return sample.slice(0, limit);
      }
    }
  }
}
