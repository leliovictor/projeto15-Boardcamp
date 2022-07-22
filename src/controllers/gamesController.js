import connection from "../config/db.js";

export async function getGames(req, res) {
  const { name } = req.query;

  try {
    if (name) {
      const { rows: gamesFilter } = await connection.query(
        `
        SELECT games.*, categories.name as "categoryName" 
        FROM games 
        JOIN categories ON games."categoryId"=categories.id
        WHERE games.name LIKE $1
        `,
        [`${name}%`]
      );

      return res.status(200).send(gamesFilter);
    }

    const { rows: games } = await connection.query(`
    SELECT games.*, categories.name as "categoryName" 
    FROM games 
    JOIN categories ON games."categoryId"=categories.id
    `);

    return res.status(200).send(games);
  } catch (err) {
    return res.sendStatus(500);
  }
}

export async function postGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
  try {
    const query =`
    INSERT INTO games ("name", "image", "stockTotal", "categoryId", "pricePerDay") 
    VALUES ($1,$2,$3,$4,$5)
    `;

    const variables = [name, image, stockTotal, categoryId, pricePerDay];

    await connection.query(query, variables);

    return res.sendStatus(201);
  } catch (err) {
    return res.sendStatus(500);
  }
}
