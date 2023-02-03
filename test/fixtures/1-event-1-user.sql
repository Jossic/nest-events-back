INSERT INTO
    "user" (
        "id",
        "username",
        "password",
        "email",
        "firstName",
        "lastName",
        "profileId"
    )
VALUES
    (
        21,
        'e2e-test2',
        '$2b$10$5v5ZIVbPGXf0126yUiiys.z/POxSaus.iSbzXj7cTRW9KWGy5bfcq',
        'e2e2@test.com',
        'End',
        'To End',
        13
    );

INSERT INTO
    "event" (
        "id",
        "description",
        "when",
        "address",
        "name",
        "organizerId"
    )
VALUES
    (
        12,
        'That is a crazy event, must go there!',
        '2021-04-15 21:00:00',
        'Local St 101',
        'Interesting Party',
        8
    )