import React from 'react'

const about = () => {
  return (
    <div>
      <section id="about">
        <div className="container my-5 py-5">
          <div className="row">
            <div className="col-md-6">
              <img src="/assets/about1.png" alt="About" className="w-75 mt-5"/>
            </div>
            <div className="col-md-6">
              <h3 className="fs-5 mb-0">
              About Us
              </h3>
              <h1 className="display-6 mb-2 ">
              who <b>We</b> Are?
              </h1>
              <hr className="w-50"/>
              <p className="lead mb-4" style={{ textAlign: "justify" }}>
  Welcome to Anigen, the leading platform for animation generation! Our mission is to revolutionize the way people consume and create multimedia content in Urdu language. At Anigen, we believe that language should never be a barrier to creativity. That's why we developed a cutting-edge technology that turns Urdu speech into stunning 3D videos, complete with an avatar speaking the Urdu text in Urdu language, with perfect lip sync. Our team of talented developers and designers has been working tirelessly to make Anigen the best platform for Urdu speakers around the world. We're passionate about empowering people to express themselves through animation, and we're committed to making the process as easy and accessible as possible. Whether you're a content creator, a marketer, or just someone who loves animation, we're confident that you'll love Anigen. So why wait? Sign up now and start creating your own animated videos in Urdu language with Anigen!
</p>

              <button className="btn btn-primary rounded-pill px-4 py-2 me-2">Get Started</button>
              <button className="btn btn-primary rounded-pill px-4 py-2">Contact Us</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default about;
