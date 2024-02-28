-- SELECT Queries:

-- Query to retrieve player information along with their Name, HighestRank, MMR, Email, CreatedAt, and Roles.
SELECT
    p.username AS Name,
    r.rankname || ' ' || CAST(r.division AS VARCHAR) AS HighestRank,
    r.mmr AS MMR,
    p.email AS Email,
    TO_CHAR(p.createdat, 'YYYY-MM-DD') AS CreatedAt,
    ARRAY_AGG(ro.rolename ORDER BY ro.rolename) AS Roles
FROM
    players p
JOIN
    (SELECT
         pr.playerid,
         MAX(rk.mmr) AS max_mmr
     FROM
         playerroles pr
     JOIN ranks rk ON pr.rankid = rk.rankid
     GROUP BY pr.playerid) AS highest_rank
ON
    p.playerid = highest_rank.playerid
JOIN
    ranks r ON highest_rank.max_mmr = r.mmr
JOIN
    playerroles pr ON p.playerid = pr.playerid
JOIN
    roles ro ON pr.roleid = ro.roleid
GROUP BY
    p.username, r.rankname, r.division, r.mmr, p.email, p.createdat
ORDER BY
    MMR DESC;