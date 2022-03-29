const url = "http://localhost:4000";

const sendRequest = async (to) => {
    try {
        await fetch(`${url}/addFriend`, {
            method: "POST",
            headers: {
                mode: "cors",
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "http://127.0.0.1:4000"
            },
            body: JSON.stringify({ to: to })
        });
    }
    catch (err) {
        console.log(err);
    };
};

//valid options for resource: requests, friends, pics, haps
const getResource = async (resource, id) => {
    try {
        const response = fetch(`${url}/${resource}/${id}`, {
            method: "GET",
            headers: {
                mode: "cors",
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "http://127.0.0.1:4000"
            }
        }).then(response => response.json()).then(jsonResponse => jsonResponse)
        return response;
    }
    catch (err) {
        console.log(err);
    };
};

const acceptFriendship = async (from) => {
    try {
        await fetch(`${url}/acceptFriend`, {
            method: "POST",
            headers: {
                mode: "cors",
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "http://127.0.0.1:4000"
            },
            body: JSON.stringify({ from: from })
        });
    }
    catch (err) {
        console.log(err);
    };
};

const setProfilePic = async (imgSrc) => {
    try {
        await fetch(`${url}/setPic`, {
            method: "POST",
            headers: {
                mode: "cors",
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "http://127.0.0.1:4000"
            },
            body: JSON.stringify({ img: imgSrc })
        }).then(response => {
            window.location.assign(response.url);
        })
    } catch (err) {
        console.log(err);
    }
}

const getActiveUserId = async () => {
    try {
       const response = await fetch(`${url}/activeUserId`, {
            method: "GET",
            headers: {
                mode: "cors",
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "http://127.0.0.1:4000"
            }
        }).then(response => response.json()).then(jsonResponse => jsonResponse)
        console.log(response)
        return response._id;
    } catch (err) {
        console.log(err)
    }
}

const setAttributes = (el, attributes) => {
    for (let key in attributes) {
        el.setAttribute(key, attributes[key]);
    };
};

const setUnsetLabamba = async (postId) => {
    try {
       await fetch(`${url}/posts/${postId}`, {
            method: "PUT",
            headers: {
                mode: "cors",
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "http://127.0.0.1:4000"
            }
        })
    } catch (err) {
        console.log(err)
    }
}
const requests = {
    sendRequest,
    getResource,
    setAttributes,
    acceptFriendship,
    setProfilePic,
    getActiveUserId,
    setUnsetLabamba
};
export default requests;