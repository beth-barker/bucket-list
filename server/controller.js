
require('dotenv').config()
const {CONNECTION_STRING} = process.env

const Sequelize = require('sequelize')

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

module.exports = {
    seed: (req, res) => {
        sequelize.query(`
        drop table if exists completed;
        drop table if exists bucketlist;
        
        CREATE TABLE bucketlist (
            list_id SERIAL PRIMARY KEY,
            item_name VARCHAR(50),
            completed BOOLEAN
        );
        
        CREATE TABLE completed (
            complete_id SERIAL PRIMARY KEY,
            list_id INT REFERENCES bucketlist(list_id),
            img_src VARCHAR(1000),
            description VARCHAR(1000)
        );

        INSERT INTO bucketlist (item_name, completed)
        VALUES
        ('See the Northern Lights', true),
        ('Skydive in Hawaii', false),
        ('Run a Marathon', false),
        ('Scuba Dive With a Tiger Shark', true),
        ('Ride in a Hot Air Ballon', false),
        ('Visit French Polynesia', true);

        INSERT INTO completed (list_id, img_src, description)
        VALUES (4, 'https://www.sharkschool.org/files/sharkschool/images/serec/920%20tigerbeach/AndreasMichaelSerec_MG_0952.jpg', 'I was finally able to see a tiger shark while scuba diving in Rangiroa, French Polynesia. Ryan and I went diving and while we were on the ocean floor watching some white tip reef sharks I saw the stripes of a tiger shark swim by in the dark water in the distance. I got my dive masters attention and he saw it too but no one else in our group looked quick enough to see it before it disappeared.'),
        (1, 'https://media.timeout.com/images/105731796/750/422/image.jpg', 'I saw the Northern Lights when I was in iceland. I was there for a week and barely slept at night because I was out looking for the lights. I did not have any luck the whole week but on the very last night I finally saw them. They stayed for two hours and I was able to get some amazing pictures. They were so magical and I hope I get to see them again someday.'),
        (6, 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/177019538.jpg?k=ab9907bcb9ba2c074a33b2d63c89910f646f68c9922b97c7e4aef55eeb2bb09f&o=&hp=1', 'I visited French Polynesia and went to Moorea, Rangiroa, and Tikehau. I was able to do a lot of scuba diving and snorkel with humpback whales. I also stayed in an over the water bungaloo and it was so cool.');
        `).then(() => {console.log('DB Seeded')}).catch((err) => {console.log('Error seeding DB', err)})
    },

    getAllItems: (req, res) => {
        sequelize.query(`
        SELECT item_name, list_id
        FROM bucketlist
        WHERE completed = false
        `).then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    getAllActivities: (req, res) => {
        sequelize.query(`
        SELECT b.item_name, c.img_src, c.description
        FROM bucketlist AS b
        JOIN completed AS c ON b.list_id = c.list_id
        `).then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },


    createCompleted: (req, res) => {
        const {listID, imgSrc, desc} = req.body
        sequelize.query(`
        INSERT INTO completed (list_id, img_src, description)
        VALUES(${listID},'${imgSrc}', '${desc}')
        `).then(dbRes => res.sendStatus(200))
        .catch(err => console.log(err))
    },

    createItem: (req, res) => {
        const {item} = req.body
        sequelize.query(`
        INSERT INTO bucketlist (item_name, completed)
        VALUES('${item}', false)
        `).then(dbRes => res.sendStatus(200))
        .catch(err => console.log(err))
    },

    deleteItem: (req, res) => {
        const{id} = req.params
        sequelize.query(`
        DELETE FROM completed
        WHERE list_id = ${id};

        DELETE FROM bucketlist
        WHERE list_id = ${id};
        `).then((dbRes) => {res.status(200).send(dbRes[0])})
        .catch(err => console.log(err))
    },

    updateCompleteValue: (req, res) => {
        const{id} = req.params
        console.log(id)
        sequelize.query(`
        UPDATE bucketlist
        SET completed = true
        WHERE list_id = ${id}
        `).then((dbRes) => {res.status(200).send(dbRes[0])})
        .catch(err => console.log(err))
    }
}